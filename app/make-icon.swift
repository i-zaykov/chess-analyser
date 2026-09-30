// Draws the app icon into an .iconset folder: a cream knight on a board-brown rounded square.
// Usage: swift make-icon.swift AppIcon.iconset && iconutil -c icns AppIcon.iconset
//        swift make-icon.swift --web DIR   (full-bleed squares for the iPhone home screen, which rounds them itself)
import AppKit

let web = CommandLine.arguments[1] == "--web"
let dir = CommandLine.arguments[web ? 2 : 1]
try FileManager.default.createDirectory(atPath: dir, withIntermediateDirectories: true)

func png(_ px: Int, flat: Bool = false) -> Data {
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: px, pixelsHigh: px, bitsPerSample: 8,
                             samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
                             bytesPerRow: 0, bitsPerPixel: 0)!
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  let s = CGFloat(px), inset = flat ? 0 : s * 0.09
  let tile = NSRect(x: inset, y: inset, width: s - 2 * inset, height: s - 2 * inset)
  NSColor(calibratedRed: 0.55, green: 0.38, blue: 0.25, alpha: 1).setFill()
  NSBezierPath(roundedRect: tile, xRadius: flat ? 0 : s * 0.2, yRadius: flat ? 0 : s * 0.2).fill()
  let attrs: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: s * 0.6),
    .foregroundColor: NSColor(calibratedRed: 0.96, green: 0.9, blue: 0.8, alpha: 1),
  ]
  let glyph = "♞" as NSString
  let size = glyph.size(withAttributes: attrs)
  glyph.draw(at: NSPoint(x: (s - size.width) / 2, y: (s - size.height) / 2), withAttributes: attrs)
  NSGraphicsContext.restoreGraphicsState()
  return rep.representation(using: .png, properties: [:])!
}

if web {
  for px in [180, 192, 512] {
    try png(px, flat: true).write(to: URL(fileURLWithPath: "\(dir)/icon-\(px).png"))
  }
} else {
  for base in [16, 32, 128, 256, 512] {
    try png(base).write(to: URL(fileURLWithPath: "\(dir)/icon_\(base)x\(base).png"))
    try png(base * 2).write(to: URL(fileURLWithPath: "\(dir)/icon_\(base)x\(base)@2x.png"))
  }
}
