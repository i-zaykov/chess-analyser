// Downloads the page's third-party files into ../vendor, so the app loads nothing from a CDN.
// The Mac app compiles them in (app/src/main.rs). Run after changing a version: npm run vendor
// The Gemini SDK, used only by the online coach report, still comes from the CDN.
import { mkdirSync, writeFileSync } from 'node:fs';

const CG = 'https://cdn.jsdelivr.net/npm/chessground@9.2.1';
const SF = 'https://unpkg.com/stockfish@17.1.0/src/stockfish-17.1-lite-single-03e3232';
const FILES = {
  'chess.js': 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm',
  'chessground.js': `${CG}/+esm`,
  'chessground.base.css': `${CG}/assets/chessground.base.css`,
  'chessground.brown.css': `${CG}/assets/chessground.brown.css`,
  'chessground.cburnett.css': `${CG}/assets/chessground.cburnett.css`,
  'qrcode.js': 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/+esm',
  'stockfish.js': `${SF}.js`,
  'stockfish.wasm': `${SF}.wasm`,
  // The design system's fonts (OFL), Latin subset with the weight axis.
  'fonts/figtree.woff2': 'https://cdn.jsdelivr.net/npm/@fontsource-variable/figtree@5.3.0/files/figtree-latin-wght-normal.woff2',
  'fonts/bricolage-grotesque.woff2': 'https://cdn.jsdelivr.net/npm/@fontsource-variable/bricolage-grotesque@5.3.0/files/bricolage-grotesque-latin-wght-normal.woff2',
};

const dir = new URL('../vendor/', import.meta.url);
mkdirSync(new URL('fonts/', dir), { recursive: true });
for (const [name, url] of Object.entries(FILES)) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  let body = Buffer.from(await r.arrayBuffer());
  if (name.endsWith('.js')) {
    // jsDelivr points source maps at its own server; drop them.
    const text = body.toString().replace(/\n\/\/# sourceMappingURL=\S+\s*$/, '\n');
    if (/from\s*["']\/npm\//.test(text)) throw new Error(`${name} imports another CDN module`);
    body = Buffer.from(text);
  }
  writeFileSync(new URL(name, dir), body);
  console.log(name.padEnd(26), body.length.toLocaleString(), 'bytes');
}
