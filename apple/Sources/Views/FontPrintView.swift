import AppKit

final class FontPrintView: NSView {
  private let pages: [FontPrintPage]
  private let pageSize: NSSize
  private let sampleText: String
  private let sampleSize: Double

  init(pages: [FontPrintPage], pageSize: NSSize, sampleText: String, sampleSize: Double) {
    self.pages = pages
    self.pageSize = pageSize
    self.sampleText = sampleText
    self.sampleSize = sampleSize
    super.init(
      frame: NSRect(
        origin: .zero,
        size: NSSize(
          width: pageSize.width,
          height: pageSize.height * Double(max(1, pages.count))
        )
      )
    )
  }

  required init?(coder: NSCoder) {
    nil
  }

  override var isFlipped: Bool { true }

  override func knowsPageRange(_ range: NSRangePointer) -> Bool {
    range.pointee = NSRange(location: 1, length: max(1, pages.count))
    return true
  }

  override func rectForPage(_ page: Int) -> NSRect {
    NSRect(
      x: 0,
      y: Double(page - 1) * pageSize.height,
      width: pageSize.width,
      height: pageSize.height
    )
  }

  override func draw(_ dirtyRect: NSRect) {
    for (index, page) in pages.enumerated() {
      let rect = rectForPage(index + 1)
      guard rect.intersects(dirtyRect) else { continue }
      FontPrintRenderer.draw(
        page,
        in: rect,
        sampleText: sampleText,
        sampleSize: sampleSize,
        pageNumber: index + 1,
        pageCount: pages.count
      )
    }
  }
}
