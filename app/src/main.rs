//! Serves the chess analyser page on localhost and opens it in the default browser.
//!
//! The page files are compiled in, so the binary runs from anywhere.
//! data/ (output of tools/batch.mjs) is read from the project folder at runtime.
//! The page pings /__ping every 30 s; the server quits once no tab has pinged for a few minutes.
//!
//! Every launch runs as a short-lived launcher: it opens a tab if the server is already up,
//! otherwise it starts the server as a detached background process and exits. macOS only
//! activates an app that is still running instead of launching it again, so the app process
//! must not be the long-lived server, or a second double-click would do nothing.
//!
//! Launches, browser opens and page requests are logged to ~/Library/Logs/Chess Analyser.log.
//!
//! iPhone mode (Settings on the Mac): the server also listens on the local network and never quits,
//! and a LaunchAgent starts it at login. Phones must pair once through a link that carries a random
//! token; the server then sets it as a cookie and refuses any network request without it. Turning the
//! mode off deletes the token, which unpairs every phone. Phones and the Mac share analyses and puzzle
//! progress through append-only files under data/ (POST /api/sync/...).
//!
//! Flags: --serve (run the server in the foreground), --no-open (don't start a browser),
//! --root DIR (serve the page files and data/ from DIR instead of the compiled-in copies).

use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::os::unix::fs::OpenOptionsExt;
use std::os::unix::process::CommandExt;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

// Compiled-in page files. With --root the same names are read from disk instead.
const PAGE: &[(&str, &[u8])] = &[
    ("index.html", include_bytes!("../../index.html")),
    ("core.mjs", include_bytes!("../../core.mjs")),
    ("eco.json", include_bytes!("../../eco.json")),
    ("icon-180.png", include_bytes!("../../icon-180.png")),
    ("icon-192.png", include_bytes!("../../icon-192.png")),
    ("icon-512.png", include_bytes!("../../icon-512.png")),
    // Third-party files (tools/vendor.mjs), so the page loads nothing from a CDN.
    ("vendor/chess.js", include_bytes!("../../vendor/chess.js")),
    ("vendor/chessground.js", include_bytes!("../../vendor/chessground.js")),
    ("vendor/chessground.base.css", include_bytes!("../../vendor/chessground.base.css")),
    ("vendor/chessground.brown.css", include_bytes!("../../vendor/chessground.brown.css")),
    ("vendor/chessground.cburnett.css", include_bytes!("../../vendor/chessground.cburnett.css")),
    ("vendor/qrcode.js", include_bytes!("../../vendor/qrcode.js")),
    ("vendor/stockfish.js", include_bytes!("../../vendor/stockfish.js")),
    ("vendor/stockfish.wasm", include_bytes!("../../vendor/stockfish.wasm")),
    ("vendor/fonts/figtree.woff2", include_bytes!("../../vendor/fonts/figtree.woff2")),
    ("vendor/fonts/bricolage-grotesque.woff2", include_bytes!("../../vendor/fonts/bricolage-grotesque.woff2")),
];
const DATA_DIR: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/../data");
// Fixed port: the browser keys the analysis cache by origin, so it must stay http://localhost:8765.
const PORT: u16 = 8765;
const SIGNATURE: &[u8] = b"chess-analyser";
const IDLE_EXIT_SECS: u64 = 180;
const AGENT_LABEL: &str = "local.chess-analyser";

struct Args {
    serve: bool,
    open: bool,
    root: Option<PathBuf>,
}

impl Args {
    fn parse() -> Args {
        let raw: Vec<String> = std::env::args().skip(1).collect();
        Args {
            serve: raw.iter().any(|a| a == "--serve"),
            open: !raw.iter().any(|a| a == "--no-open"),
            root: raw.iter().position(|a| a == "--root").and_then(|i| raw.get(i + 1)).map(PathBuf::from),
        }
    }
}

struct Server {
    port: u16,
    root: Option<PathBuf>,
    last_ping: AtomicU64,
    // Set in iPhone mode: the pairing token phones must present.
    phone: Option<String>,
}

// Who is asking: this Mac (a loopback connection), a paired phone, or nobody we trust.
#[derive(PartialEq)]
enum Access {
    Mac,
    Phone { pairing: bool },
    Denied,
}

fn main() {
    let args = Args::parse();
    if args.serve {
        serve(args);
    } else if already_running() {
        log("launch: server already running");
        if args.open {
            open_browser(PORT);
        }
    } else {
        log("launch: starting server");
        // New process group, so the server outlives this launcher and isn't tied to its session.
        let exe = std::env::current_exe().expect("cannot find own executable");
        Command::new(exe)
            .arg("--serve")
            .args(std::env::args().skip(1))
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .process_group(0)
            .spawn()
            .expect("cannot start server");
    }
}

fn serve(args: Args) {
    let phone = phone_token();
    let host = if phone.is_some() { "0.0.0.0" } else { "127.0.0.1" };
    let listener = match TcpListener::bind((host, PORT)) {
        Ok(l) => l,
        Err(_) if already_running() => {
            if args.open {
                open_browser(PORT);
            }
            return;
        }
        // Something else owns the port. Serve anyway, with a separate cache.
        Err(_) => TcpListener::bind((host, 0)).expect("no free port"),
    };
    let port = listener.local_addr().map(|a| a.port()).unwrap_or(PORT);
    let phone_mode = phone.is_some();
    let server = Arc::new(Server { port, root: args.root, last_ping: AtomicU64::new(now()), phone });
    log(&format!("server: listening on {host}:{port}{}", if phone_mode { " (iPhone mode)" } else { "" }));

    // Browsers try ::1 first for "localhost"; answering there avoids a fallback delay.
    if let Ok(v6) = TcpListener::bind(("::1", port)) {
        let server = server.clone();
        thread::spawn(move || accept(v6, server));
    }

    // In iPhone mode the server stays up for the phone; otherwise it quits once no tab is open.
    let watchdog = server.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_secs(15));
        if !phone_mode && now().saturating_sub(watchdog.last_ping.load(Ordering::Relaxed)) > IDLE_EXIT_SECS {
            log("server: no open tab, quitting");
            std::process::exit(0);
        }
    });

    if args.open {
        open_browser(port);
    }
    accept(listener, server);
}

fn accept(listener: TcpListener, server: Arc<Server>) {
    for stream in listener.incoming().flatten() {
        let server = server.clone();
        thread::spawn(move || server.handle(stream));
    }
}

impl Server {
    fn handle(&self, mut s: TcpStream) {
        let Some((req, rest)) = read_head(&mut s) else { return };
        let mut first = req.lines().next().unwrap_or("").split_whitespace();
        let (method, target) = (first.next().unwrap_or(""), first.next().unwrap_or("/"));
        let head = method == "HEAD";
        let path = target.split(['?', '#']).next().unwrap_or("/");
        let access = self.access(&s, &req, target);
        if access == Access::Denied {
            let msg = b"This Chess Analyser needs pairing. Open the iPhone link from Settings on the Mac.";
            return respond(&mut s, 403, "text/plain; charset=utf-8", msg, head);
        }
        let mac = access == Access::Mac;
        // A phone opening its pairing link gets the token as a cookie for every later request.
        let cookie = match (&access, &self.phone) {
            (Access::Phone { pairing: true }, Some(t)) => format!("Set-Cookie: ca_token={t}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax\r\n"),
            _ => String::new(),
        };

        if method == "POST" {
            // Other sites can make a browser post here, but it carries their Origin.
            if header(&req, "origin").strip_prefix("http://") != Some(header(&req, "host")) {
                return respond(&mut s, 403, "text/plain", b"forbidden", false);
            }
            let Some(body) = read_body(&mut s, &req, rest) else {
                return respond(&mut s, 400, "text/plain", b"bad request body", false);
            };
            log(&format!("POST {path}"));
            return match path {
                "/api/phone" if mac => self.set_phone(&mut s, &body),
                "/api/sync/analysis" | "/api/sync/progress" => self.append_sync(&mut s, path, target, &body),
                _ => respond(&mut s, 404, "text/plain", b"not found", false),
            };
        }
        if method != "GET" && !head {
            return respond(&mut s, 405, "text/plain", b"method not allowed", head);
        }
        if path == "/__ping" {
            self.last_ping.store(now(), Ordering::Relaxed);
            return respond(&mut s, 200, "text/plain", SIGNATURE, head);
        }
        if path == "/api/phone" && mac {
            return respond(&mut s, 200, "application/json", self.phone_status().as_bytes(), head);
        }
        if path == "/manifest.webmanifest" {
            return respond(&mut s, 200, "application/manifest+json", self.manifest(access, target).as_bytes(), head);
        }
        let agent = header(&req, "user-agent").rsplit(' ').take(2).collect::<Vec<_>>().join(" ");
        log(&format!("{method} {path} ({agent})"));

        let rel = if path == "/" { "index.html".to_string() } else { percent_decode(&path[1..]) };
        match self.file(&rel) {
            Some(body) => respond_with(&mut s, 200, content_type(&rel), &body, head, &cookie),
            None => respond(&mut s, 404, "text/plain", b"not found", head),
        }
    }

    fn access(&self, s: &TcpStream, req: &str, target: &str) -> Access {
        if s.peer_addr().is_ok_and(|a| a.ip().is_loopback()) {
            // Only answer requests addressed to this machine by name, which blocks DNS-rebinding pages.
            let host = header(req, "host");
            let named = ["localhost", "127.0.0.1", "[::1]"].iter().any(|h| host == format!("{h}:{}", self.port));
            return if named { Access::Mac } else { Access::Denied };
        }
        let Some(token) = &self.phone else { return Access::Denied };
        if query(target, "pair") == Some(token.as_str()) {
            return Access::Phone { pairing: true };
        }
        let cookie = header(req, "cookie").split(';').find_map(|c| c.trim().strip_prefix("ca_token="));
        if cookie == Some(token.as_str()) { Access::Phone { pairing: false } } else { Access::Denied }
    }

    fn data_dir(&self) -> PathBuf {
        self.root.as_ref().map_or_else(|| PathBuf::from(DATA_DIR), |r| r.join("data"))
    }

    // One JSON line appended to data/<user>/<month>.live.ndjson or data/<user>/progress.ndjson.
    // Appends are whole lines in one write, so concurrent devices never interleave.
    fn append_sync(&self, s: &mut TcpStream, path: &str, target: &str, body: &[u8]) {
        let plain = |v: &str, extra: &[u8]| !v.is_empty() && v.len() <= 64 && v.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || extra.contains(&b));
        let user = query(target, "user").unwrap_or("");
        let file = if path.ends_with("analysis") {
            let ym = query(target, "ym").unwrap_or("");
            if ym.len() != 7 || !plain(ym, b"-") { return respond(s, 400, "text/plain", b"bad month", false) }
            format!("{ym}.live.ndjson")
        } else {
            "progress.ndjson".to_string()
        };
        let line = body.trim_ascii();
        if !plain(user, b"_-") || line.first() != Some(&b'{') || line.last() != Some(&b'}') || line.contains(&b'\n') {
            return respond(s, 400, "text/plain", b"bad sync record", false);
        }
        let dir = self.data_dir().join(user);
        let written = std::fs::create_dir_all(&dir)
            .and_then(|_| std::fs::OpenOptions::new().create(true).append(true).open(dir.join(file)))
            .and_then(|mut f| f.write_all(&[line, b"\n"].concat()));
        match written {
            Ok(()) => respond(s, 200, "application/json", br#"{"ok":true}"#, false),
            Err(_) => respond(s, 500, "text/plain", b"couldn't save", false),
        }
    }

    fn phone_status(&self) -> String {
        let Some(token) = phone_token() else { return r#"{"enabled":false}"#.to_string() };
        let name = run("scutil", &["--get", "LocalHostName"]).map(|n| format!("{n}.local"));
        let ip = run("ipconfig", &["getifaddr", "en0"]).or_else(|| run("ipconfig", &["getifaddr", "en1"]));
        let link = |h: Option<String>| h.map_or("null".to_string(), |h| format!(r#""http://{h}:{}/?pair={token}""#, self.port));
        format!(r#"{{"enabled":true,"url":{},"ipUrl":{},"running":{}}}"#, link(name), link(ip), self.phone.is_some())
    }

    // Turns iPhone mode on or off, then restarts this server in place so it binds accordingly.
    fn set_phone(&self, s: &mut TcpStream, body: &[u8]) {
        let on = body.trim_ascii() == b"on";
        let changed = if on { enable_phone() } else { disable_phone() };
        if changed.is_err() {
            return respond(s, 500, "text/plain", b"couldn't change iPhone mode", false);
        }
        respond(s, 200, "application/json", self.phone_status().as_bytes(), false);
        let _ = s.flush();
        log(&format!("server: iPhone mode {}, restarting", if on { "on" } else { "off" }));
        let mut cmd = Command::new(std::env::current_exe().expect("cannot find own executable"));
        cmd.args(["--serve", "--no-open"]);
        if let Some(r) = &self.root {
            cmd.arg("--root").arg(r);
        }
        let err = cmd.exec(); // only returns on failure; sockets close on exec
        log(&format!("server: restart failed: {err}"));
    }

    // The home-screen app starts from a URL that pairs it, since iOS keeps its cookies and storage
    // apart from Safari's, and that names the account (?user=, set by the page) to load.
    fn manifest(&self, access: Access, target: &str) -> String {
        let pair = match (&access, &self.phone) {
            (Access::Phone { .. }, Some(t)) => format!("?pair={t}"),
            _ => String::new(),
        };
        let user = query(target, "user").filter(|u| u.len() <= 64 && u.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b"_-".contains(&b)));
        let start = format!("/{pair}{}", user.map(|u| format!("#{u}")).unwrap_or_default());
        format!(
            r##"{{"name":"Chess Analyser","short_name":"Chess","start_url":"{start}","scope":"/","display":"standalone","background_color":"#f4f3ef","theme_color":"#ffffff","icons":[{{"src":"icon-192.png","sizes":"192x192","type":"image/png"}},{{"src":"icon-512.png","sizes":"512x512","type":"image/png"}}]}}"##
        )
    }

    // A page file (compiled in, or from --root) or a batch result under data/. Nothing else is reachable.
    fn file(&self, rel: &str) -> Option<Vec<u8>> {
        if rel.split('/').any(|seg| seg.is_empty() || seg == "." || seg == "..") {
            return None;
        }
        if let Some(rest) = rel.strip_prefix("data/") {
            return std::fs::read(self.data_dir().join(rest)).ok();
        }
        let (name, bytes) = PAGE.iter().find(|(name, _)| *name == rel)?;
        match &self.root {
            Some(root) => std::fs::read(root.join(name)).ok(),
            None => Some(bytes.to_vec()),
        }
    }
}

// The request head, and whatever part of the body arrived with it.
fn read_head(s: &mut TcpStream) -> Option<(String, Vec<u8>)> {
    let _ = s.set_read_timeout(Some(Duration::from_secs(5)));
    let mut buf = vec![0u8; 16 * 1024];
    let mut n = 0;
    while n < buf.len() {
        match s.read(&mut buf[n..]) {
            Ok(0) => break,
            Ok(k) => {
                n += k;
                if let Some(end) = buf[..n].windows(4).position(|w| w == b"\r\n\r\n") {
                    let head = String::from_utf8_lossy(&buf[..end]).into_owned();
                    return Some((head, buf[end + 4..n].to_vec()));
                }
            }
            Err(_) => return None,
        }
    }
    Some((String::from_utf8_lossy(&buf[..n]).into_owned(), Vec::new()))
}

const MAX_BODY: usize = 1 << 20; // POSTs are sync records: one game's analysis is a few KB

fn read_body(s: &mut TcpStream, req: &str, mut body: Vec<u8>) -> Option<Vec<u8>> {
    let len: usize = header(req, "content-length").parse().ok()?;
    if len > MAX_BODY {
        return None;
    }
    let _ = s.set_read_timeout(Some(Duration::from_secs(30)));
    while body.len() < len {
        let mut chunk = vec![0u8; (len - body.len()).min(64 * 1024)];
        let k = s.read(&mut chunk).ok().filter(|&k| k > 0)?;
        body.extend_from_slice(&chunk[..k]);
    }
    body.truncate(len);
    Some(body)
}

fn support_dir() -> Option<PathBuf> {
    Some(PathBuf::from(std::env::var_os("HOME")?).join("Library/Application Support/Chess Analyser"))
}

fn phone_token() -> Option<String> {
    let t = std::fs::read_to_string(support_dir()?.join("phone-token")).ok()?;
    Some(t.trim().to_string()).filter(|t| t.len() == 32)
}

fn agent_path() -> Option<PathBuf> {
    Some(PathBuf::from(std::env::var_os("HOME")?).join(format!("Library/LaunchAgents/{AGENT_LABEL}.plist")))
}

// A fresh pairing token, and a LaunchAgent so the server is running for the phone after every login.
fn enable_phone() -> std::io::Result<()> {
    let dir = support_dir().ok_or(std::io::ErrorKind::NotFound)?;
    std::fs::create_dir_all(&dir)?;
    if phone_token().is_none() {
        let mut bytes = [0u8; 16];
        std::fs::File::open("/dev/urandom")?.read_exact(&mut bytes)?;
        let token: String = bytes.iter().map(|b| format!("{b:02x}")).collect();
        let mut f = std::fs::OpenOptions::new().create(true).write(true).truncate(true).mode(0o600).open(dir.join("phone-token"))?;
        f.write_all(token.as_bytes())?;
    }
    let exe = std::env::current_exe()?;
    let plist = format!(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>{AGENT_LABEL}</string>
  <key>ProgramArguments</key><array><string>{}</string><string>--serve</string><string>--no-open</string></array>
  <key>RunAtLoad</key><true/>
</dict></plist>
"#,
        exe.display()
    );
    let agent = agent_path().ok_or(std::io::ErrorKind::NotFound)?;
    std::fs::create_dir_all(agent.parent().ok_or(std::io::ErrorKind::NotFound)?)?;
    std::fs::write(agent, plist)
}

// Deleting the token unpairs every phone.
fn disable_phone() -> std::io::Result<()> {
    for path in [support_dir().map(|d| d.join("phone-token")), agent_path()].into_iter().flatten() {
        match std::fs::remove_file(path) {
            Err(e) if e.kind() != std::io::ErrorKind::NotFound => return Err(e),
            _ => {}
        }
    }
    Ok(())
}

fn run(cmd: &str, args: &[&str]) -> Option<String> {
    let out = Command::new(cmd).args(args).output().ok()?;
    Some(String::from_utf8_lossy(&out.stdout).trim().to_string()).filter(|v| out.status.success() && !v.is_empty())
}

fn query<'a>(target: &'a str, key: &str) -> Option<&'a str> {
    target.split_once('?')?.1.split('&').find_map(|kv| kv.strip_prefix(key)?.strip_prefix('='))
}

fn header<'a>(req: &'a str, name: &str) -> &'a str {
    req.lines()
        .skip(1)
        .find_map(|l| l.split_once(':').filter(|(k, _)| k.trim().eq_ignore_ascii_case(name)).map(|(_, v)| v.trim()))
        .unwrap_or("")
}

fn already_running() -> bool {
    let Ok(mut s) = TcpStream::connect_timeout(&([127, 0, 0, 1], PORT).into(), Duration::from_secs(1)) else {
        return false;
    };
    let _ = s.set_read_timeout(Some(Duration::from_secs(1)));
    let req = format!("GET /__ping HTTP/1.0\r\nHost: localhost:{PORT}\r\n\r\n");
    if s.write_all(req.as_bytes()).is_err() {
        return false;
    }
    let mut body = Vec::new();
    let _ = s.read_to_end(&mut body);
    body.windows(SIGNATURE.len()).any(|w| w == SIGNATURE)
}

fn open_browser(port: u16) {
    let url = format!("http://localhost:{port}/");
    #[cfg(target_os = "macos")]
    let r = Command::new("open").arg(&url).status();
    #[cfg(target_os = "windows")]
    let r = Command::new("cmd").args(["/C", "start", "", &url]).status();
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    let r = Command::new("xdg-open").arg(&url).status();
    log(&format!("open {url}: {}", r.map_or_else(|e| e.to_string(), |s| s.to_string())));
}

fn content_type(path: &str) -> &'static str {
    match path.rsplit('.').next() {
        Some("html") => "text/html; charset=utf-8",
        Some("json") => "application/json",
        Some("js" | "mjs") => "text/javascript",
        Some("css") => "text/css",
        Some("wasm") => "application/wasm",
        Some("png") => "image/png",
        Some("woff2") => "font/woff2",
        Some("ndjson") => "application/x-ndjson",
        _ => "application/octet-stream",
    }
}

fn respond(s: &mut TcpStream, code: u16, ctype: &str, body: &[u8], head: bool) {
    respond_with(s, code, ctype, body, head, "");
}

fn respond_with(s: &mut TcpStream, code: u16, ctype: &str, body: &[u8], head: bool, extra: &str) {
    let reason = match code {
        200 => "OK",
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        405 => "Method Not Allowed",
        500 => "Internal Server Error",
        _ => "Bad Gateway",
    };
    let header = format!(
        "HTTP/1.1 {code} {reason}\r\nContent-Type: {ctype}\r\nContent-Length: {}\r\nCache-Control: no-cache\r\n{extra}Connection: close\r\n\r\n",
        body.len()
    );
    let _ = s.write_all(header.as_bytes());
    if !head {
        let _ = s.write_all(body);
    }
}

fn percent_decode(s: &str) -> String {
    let b = s.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'%' && i + 2 < b.len() {
            if let Some(v) = std::str::from_utf8(&b[i + 1..i + 3]).ok().and_then(|h| u8::from_str_radix(h, 16).ok()) {
                out.push(v);
                i += 3;
                continue;
            }
        }
        out.push(b[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

fn log(msg: &str) {
    let Some(home) = std::env::var_os("HOME") else { return };
    let path = PathBuf::from(home).join("Library/Logs/Chess Analyser.log");
    if std::fs::metadata(&path).map_or(false, |m| m.len() > 1 << 20) {
        let _ = std::fs::remove_file(&path);
    }
    // One write per line: request threads log concurrently, and O_APPEND keeps a single write whole.
    if let Ok(mut f) = std::fs::OpenOptions::new().create(true).append(true).open(&path) {
        let _ = f.write_all(format!("{} [{}] {msg}\n", now(), std::process::id()).as_bytes());
    }
}

fn now() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).map_or(0, |d| d.as_secs())
}
