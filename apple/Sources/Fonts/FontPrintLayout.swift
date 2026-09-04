import CoreGraphics

enum FontPrintLayout {
  static let waterfallSizes: [Double] = [8, 10, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96]

  static func cellSize(forGlyphSize size: Double) -> CGSize {
    CGSize(width: size * 1.8, height: size * 2.2)
  }

  static func rowsPerPage(contentHeight: Double, rowHeight: Double) -> Int {
    guard rowHeight > 0, contentHeight > 0 else { return 1 }
    return max(1, Int(contentHeight / rowHeight))
  }

  static func gridCapacity(contentSize: CGSize, cellSize: CGSize) -> (columns: Int, rows: Int) {
    let columns = cellSize.width > 0 ? Int(contentSize.width / cellSize.width) : 0
    let rows = cellSize.height > 0 ? Int(contentSize.height / cellSize.height) : 0
    return (max(1, columns), max(1, rows))
  }

  static func catalogPages(_ targets: [FontPrintTarget], rowsPerPage: Int) -> [FontPrintPage] {
    chunks(targets, size: rowsPerPage).map { .catalog(targets: $0) }
  }

  static func repertoirePages(
    _ target: FontPrintTarget,
    glyphs: [FontGlyph],
    columns: Int,
    rows: Int
  ) -> [FontPrintPage] {
    let capacity = max(1, columns) * max(1, rows)
    return chunks(glyphs, size: capacity).map {
      .repertoire(target: target, glyphs: $0, columns: max(1, columns))
    }
  }

  static func waterfallPages(
    _ target: FontPrintTarget,
    sizes: [Double],
    contentHeight: Double,
    lineSpacing: Double
  ) -> [FontPrintPage] {
    guard !sizes.isEmpty else { return [] }

    var pages: [FontPrintPage] = []
    var current: [Double] = []
    var height: Double = 0

    for size in sizes {
      let lineHeight = size * 1.4 + lineSpacing
      if !current.isEmpty, height + lineHeight > contentHeight {
        pages.append(.waterfall(target: target, sizes: current))
        current = []
        height = 0
      }
      current.append(size)
      height += lineHeight
    }

    if !current.isEmpty {
      pages.append(.waterfall(target: target, sizes: current))
    }
    return pages
  }

  private static func chunks<Element>(_ items: [Element], size: Int) -> [[Element]] {
    guard !items.isEmpty, size > 0 else { return [] }
    return stride(from: 0, to: items.count, by: size).map {
      Array(items[$0..<min($0 + size, items.count)])
    }
  }
}
