import AppKit

enum FontPrintRenderer {
  static let margin: Double = 36
  static let catalogRowHeight: Double = 72
  static let headerHeight: Double = 32
  static let glyphSize: Double = 24

  static func draw(
    _ page: FontPrintPage,
    in rect: CGRect,
    sampleText: String,
    sampleSize: Double,
    pageNumber: Int,
    pageCount: Int
  ) {
    switch page {
    case .catalog(let targets):
      drawCatalog(targets, in: rect, sampleText: sampleText, sampleSize: sampleSize)
    case .repertoire(let target, let glyphs, let columns):
      drawRepertoire(target, glyphs: glyphs, columns: columns, in: rect)
    case .waterfall(let target, let sizes):
      drawWaterfall(target, sizes: sizes, in: rect, sampleText: sampleText)
    }
    drawFooter(pageNumber: pageNumber, pageCount: pageCount, in: rect)
  }

  private static func drawCatalog(
    _ targets: [FontPrintTarget],
    in rect: CGRect,
    sampleText: String,
    sampleSize: Double
  ) {
    var y = rect.minY + margin
    let width = rect.width - margin * 2

    for target in targets {
      draw(target.label, font: .systemFont(ofSize: 9), at: CGPoint(x: rect.minX + margin, y: y))
      y += 14

      if let font = PreviewFont.make(postScriptName: target.postScriptName, size: sampleSize)
        as NSFont?
      {
        draw(sampleText, font: font, at: CGPoint(x: rect.minX + margin, y: y), width: width)
      }
      y += catalogRowHeight - 14
    }
  }

  private static func drawRepertoire(
    _ target: FontPrintTarget,
    glyphs: [FontGlyph],
    columns: Int,
    in rect: CGRect
  ) {
    draw(
      target.label, font: .boldSystemFont(ofSize: 11),
      at: CGPoint(x: rect.minX + margin, y: rect.minY + margin))

    guard
      let font = PreviewFont.make(postScriptName: target.postScriptName, size: glyphSize)
        as NSFont?
    else { return }
    let cell = FontPrintLayout.cellSize(forGlyphSize: glyphSize)
    let origin = CGPoint(x: rect.minX + margin, y: rect.minY + margin + headerHeight)

    for (index, glyph) in glyphs.enumerated() {
      let x = origin.x + Double(index % columns) * cell.width
      let y = origin.y + Double(index / columns) * cell.height

      draw(glyph.text, font: font, at: CGPoint(x: x, y: y), width: cell.width)
      draw(
        glyph.codePoint, font: .systemFont(ofSize: 6),
        at: CGPoint(x: x, y: y + glyphSize * 1.3), width: cell.width)
    }
  }

  private static func drawWaterfall(
    _ target: FontPrintTarget,
    sizes: [Double],
    in rect: CGRect,
    sampleText: String
  ) {
    draw(
      target.label, font: .boldSystemFont(ofSize: 11),
      at: CGPoint(x: rect.minX + margin, y: rect.minY + margin))

    var y = rect.minY + margin + headerHeight
    let width = rect.width - margin * 2

    for size in sizes {
      draw(
        "\(Int(size)) pt", font: .systemFont(ofSize: 7),
        at: CGPoint(x: rect.minX + margin, y: y))
      y += 10

      if let font = PreviewFont.make(postScriptName: target.postScriptName, size: size) as NSFont? {
        draw(sampleText, font: font, at: CGPoint(x: rect.minX + margin, y: y), width: width)
      }
      y += size * 1.4 + 12
    }
  }

  private static func drawFooter(pageNumber: Int, pageCount: Int, in rect: CGRect) {
    draw(
      "\(pageNumber) / \(pageCount)",
      font: .systemFont(ofSize: 8),
      at: CGPoint(x: rect.minX + margin, y: rect.maxY - margin),
      width: rect.width - margin * 2,
      color: .secondaryLabelColor
    )
  }

  private static func draw(
    _ text: String,
    font: NSFont,
    at point: CGPoint,
    width: Double = .greatestFiniteMagnitude,
    color: NSColor = .labelColor
  ) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.lineBreakMode = .byTruncatingTail

    let attributed = NSAttributedString(
      string: text,
      attributes: [.font: font, .foregroundColor: color, .paragraphStyle: paragraph]
    )
    attributed.draw(
      in: CGRect(x: point.x, y: point.y, width: width, height: font.pointSize * 1.6))
  }
}
