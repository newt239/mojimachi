import AppKit
import Foundation

@MainActor
@Observable
final class FontPrintModel {
  private enum Key {
    static let style = "printStyle"
    static let sampleText = "printSampleText"
    static let sampleSize = "printSampleSize"
  }

  private let glyphCatalog = GlyphCatalog()
  private let defaults: UserDefaults
  private var buildTask: Task<Void, Never>?

  var isPresented = false

  private(set) var targets: [FontPrintTarget] = []
  private(set) var pages: [FontPrintPage] = []
  private(set) var isBuilding = false

  var style: FontPrintStyle {
    didSet {
      defaults.set(style.rawValue, forKey: Key.style)
      rebuild()
    }
  }

  var sampleText: String {
    didSet {
      defaults.set(sampleText, forKey: Key.sampleText)
      rebuild()
    }
  }

  var sampleSize: Double {
    didSet {
      defaults.set(sampleSize, forKey: Key.sampleSize)
      rebuild()
    }
  }

  var selectedTargetID: FontPrintTarget.ID? {
    didSet {
      guard selectedTargetID != oldValue else { return }
      rebuild()
    }
  }

  init(defaults: UserDefaults = .standard) {
    self.defaults = defaults
    style = FontPrintStyle(rawValue: defaults.string(forKey: Key.style) ?? "") ?? .catalog
    sampleText = defaults.string(forKey: Key.sampleText) ?? FontBrowserModel.presetTexts[0]
    sampleSize = defaults.object(forKey: Key.sampleSize) as? Double ?? 18
  }

  var selectedTarget: FontPrintTarget? {
    targets.first { $0.id == selectedTargetID } ?? targets.first
  }

  var pageCount: Int { pages.count }

  func prepare(_ families: [FontFamily], weight: PreviewWeight, isItalic: Bool) {
    targets = families.compactMap { family in
      guard let style = family.style(nearestWeight: weight.rawValue, italic: isItalic) else {
        return nil
      }
      return FontPrintTarget(
        familyName: family.name,
        postScriptName: style.postScriptName,
        styleName: style.styleName
      )
    }

    if !targets.contains(where: { $0.id == selectedTargetID }) {
      selectedTargetID = targets.first?.id
    }
    rebuild()
  }

  func run() {
    guard !pages.isEmpty else { return }

    let info = NSPrintInfo.shared
    info.horizontalPagination = .clip
    info.verticalPagination = .clip

    let view = FontPrintView(
      pages: pages,
      pageSize: info.imageablePageBounds.size,
      sampleText: sampleText,
      sampleSize: sampleSize
    )
    let operation = NSPrintOperation(view: view, printInfo: info)
    operation.jobTitle = "もじまち フォントカタログ"

    isPresented = false

    if let window = NSApp.keyWindow {
      operation.runModal(for: window, delegate: nil, didRun: nil, contextInfo: nil)
    } else {
      operation.run()
    }
  }

  private func rebuild() {
    buildTask?.cancel()
    isBuilding = false

    guard !targets.isEmpty else {
      pages = []
      return
    }

    switch style {
    case .catalog:
      pages = FontPrintLayout.catalogPages(
        targets,
        rowsPerPage: FontPrintLayout.rowsPerPage(
          contentHeight: contentSize.height,
          rowHeight: FontPrintRenderer.catalogRowHeight
        )
      )
    case .waterfall:
      guard let target = selectedTarget else {
        pages = []
        return
      }
      pages = FontPrintLayout.waterfallPages(
        target,
        sizes: FontPrintLayout.waterfallSizes,
        contentHeight: contentSize.height,
        lineSpacing: 22
      )
    case .repertoire:
      guard let target = selectedTarget else {
        pages = []
        return
      }
      buildRepertoire(for: target)
    }
  }

  private func buildRepertoire(for target: FontPrintTarget) {
    pages = []
    isBuilding = true

    buildTask = Task { [glyphCatalog, contentSize] in
      let blocks = await glyphCatalog.blocks(forPostScriptName: target.postScriptName)
      guard !Task.isCancelled else { return }

      let capacity = FontPrintLayout.gridCapacity(
        contentSize: contentSize,
        cellSize: FontPrintLayout.cellSize(forGlyphSize: FontPrintRenderer.glyphSize)
      )
      pages = FontPrintLayout.repertoirePages(
        target,
        glyphs: blocks.flatMap(\.glyphs),
        columns: capacity.columns,
        rows: capacity.rows
      )
      isBuilding = false
    }
  }

  private var contentSize: CGSize {
    let page = NSPrintInfo.shared.imageablePageBounds.size
    return CGSize(
      width: page.width - FontPrintRenderer.margin * 2,
      height: page.height - FontPrintRenderer.margin * 2 - FontPrintRenderer.headerHeight
    )
  }
}
