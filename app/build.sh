#!/bin/sh
# Builds "Chess Analyser.app" with index.html, eco.json, the icons and vendor/ compiled in, then installs it to ~/Applications.
# Run again after changing index.html.
set -e
cd "$(dirname "$0")"
cargo build --release --quiet
if [ ! -f AppIcon.icns ]; then
  swift make-icon.swift AppIcon.iconset
  iconutil -c icns AppIcon.iconset -o AppIcon.icns
  rm -rf AppIcon.iconset
fi
APP="dist/Chess Analyser.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp target/release/chess-analyser "$APP/Contents/MacOS/"
cp Info.plist "$APP/Contents/"
cp AppIcon.icns "$APP/Contents/Resources/"
codesign --force --deep --sign - "$APP" 2>/dev/null
mkdir -p "$HOME/Applications"
rm -rf "$HOME/Applications/Chess Analyser.app"
cp -R "$APP" "$HOME/Applications/"
echo "Installed ~/Applications/Chess Analyser.app"
