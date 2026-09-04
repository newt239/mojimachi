import AppKit
import Foundation
import SwiftUI

@MainActor
@Observable
final class FontDetailModel {
  private enum Key {
    static let tab = "detailTab"
    static let sampleText = "detailSampleText"
    static let sampleSize = "detailSampleSize"
    static let lineSpacing = "detailLineSpacing"
    static let foreground = "detailForeground"
    static let background = "detailBackground"
  }

  private static let notableLanguages = ["ja", "en", "zh-Hans", "zh-Hant", "ko"]

  static let defaultSampleText = """
    あのイーハトーヴォのすきとおった風、
    夏でも底に冷たさをもつ青いそら。
    The quick brown fox jumps over the lazy dog.
    """

  let family: FontFamily

  private let glyphCatalog = GlyphCatalog()
  private let defaults: UserDefaults
  private var glyphTask: Task<Void, Never>?
  private var coverageTask: Task<Void, Never>?

  private(set) var nameRecords: [FontNameRecord] = []
  private(set) var totalGlyphCount = 0
  private(set) var languages: [String] = []
  private(set) var fileSize: Int?
  private(set) var axes: [FontVariationAxis] = []
  private(set) var blocks: [UnicodeBlockGlyphs] = []
  private(set) var features: [FontFeature] = []
  private(set) var coverages: [FontCharacterSetCoverage] = []
  private(set) var isLoadingCoverage = false
  private(set) var isLoadingGlyphs = false

  var axisValues: [Int: Double] = [:]
  var featureSelections: [Int: Int] = [:]
  var selectedBlockID: UnicodeBlock.ID?
  var glyphSearchText = ""
  var copiedGlyph: FontGlyph?

  var selectedStyle: FontStyle {
    didSet {
      guard selectedStyle != oldValue else { return }
      loadStyle()
    }
  }

  var tab: FontDetailTab {
    didSet { defaults.set(tab.rawValue, forKey: Key.tab) }
  }

  var sampleText: String {
    didSet { defaults.set(sampleText, forKey: Key.sampleText) }
  }

  var sampleSize: Double {
    didSet { defaults.set(sampleSize, forKey: Key.sampleSize) }
  }

  var lineSpacing: Double {
    didSet { defaults.set(lineSpacing, forKey: Key.lineSpacing) }
  }

  var foreground: NSColor {
    didSet { store(foreground, forKey: Key.foreground) }
  }

  var background: NSColor {
    didSet { store(background, forKey: Key.background) }
  }

  init(family: FontFamily, style: FontStyle?, defaults: UserDefaults = .standard) {
    self.family = family
    self.defaults = defaults
    selectedStyle =
      style ?? family.representativeStyle
      ?? FontStyle(
        postScriptName: "",
        styleName: "",
        weight: 0,
        isItalic: false,
        isMonospaced: false,
        fileURL: nil
      )
    tab = FontDetailTab(rawValue: defaults.string(forKey: Key.tab) ?? "") ?? .info
    sampleText = defaults.string(forKey: Key.sampleText) ?? Self.defaultSampleText
    sampleSize = defaults.object(forKey: Key.sampleSize) as? Double ?? 36
    lineSpacing = defaults.object(forKey: Key.lineSpacing) as? Double ?? 8
    foreground = Self.color(defaults.object(forKey: Key.foreground) as? [Double]) ?? .black
    background = Self.color(defaults.object(forKey: Key.background) as? [Double]) ?? .white
  }

  var selectedBlock: UnicodeBlockGlyphs? {
    blocks.first { $0.id == selectedBlockID } ?? blocks.first
  }

  var glyphs: [FontGlyph] {
    let query = glyphSearchText.trimmingCharacters(in: .whitespaces)
    guard !query.isEmpty else {
      return selectedBlock?.glyphs ?? []
    }
    return blocks.flatMap(\.glyphs).filter { matches($0, query: query) }
  }

  var isSearching: Bool {
    !glyphSearchText.trimmingCharacters(in: .whitespaces).isEmpty
  }

  var glyphCount: Int {
    blocks.reduce(0) { $0 + $1.glyphs.count }
  }

  var languageSummary: String {
    guard !languages.isEmpty else { return "" }
    let available = Set(languages)
    let leading = Self.notableLanguages.filter(available.contains)
      .compactMap { Locale.current.localizedString(forIdentifier: $0) }
    let rest = languages.count - leading.count
    guard !leading.isEmpty else { return "\(languages.count) 言語" }
    return rest > 0
      ? "\(leading.joined(separator: "、"))ほか \(rest) 言語"
      : leading.joined(separator: "、")
  }

  var fileSizeText: String? {
    fileSize.map { ByteCountFormatter.string(fromByteCount: Int64($0), countStyle: .file) }
  }

  func load() {
    loadStyle()
  }

  var usesCustomFeatures: Bool {
    features.contains { featureSelections[$0.identifier] != $0.defaultSelector?.identifier }
  }

  var hasJapaneseCoverage: Bool {
    coverages.contains { $0.coveredCount > 0 }
  }

  var usesCustomAxisValues: Bool {
    axes.contains { axisValues[$0.identifier] != $0.defaultValue }
  }

  func font(size: Double) -> Font {
    guard
      let ctFont = FontDetails.font(
        postScriptName: selectedStyle.postScriptName,
        size: size,
        variations: usesCustomAxisValues ? axisValues : [:],
        features: usesCustomFeatures ? featureSelections : [:]
      )
    else {
      return .system(size: size)
    }
    return Font(ctFont)
  }

  func copy(_ glyph: FontGlyph) {
    NSPasteboard.general.clearContents()
    NSPasteboard.general.setString(glyph.text, forType: .string)
    copiedGlyph = glyph
  }

  func revealInFinder() {
    guard let url = selectedStyle.fileURL else { return }
    NSWorkspace.shared.activateFileViewerSelecting([url])
  }

  func resetAxes() {
    axisValues = Dictionary(uniqueKeysWithValues: axes.map { ($0.identifier, $0.defaultValue) })
  }

  func resetFeatures() {
    featureSelections = Dictionary(
      uniqueKeysWithValues: features.compactMap { feature in
        feature.defaultSelector.map { (feature.identifier, $0.identifier) }
      }
    )
  }

  private func loadStyle() {
    let postScriptName = selectedStyle.postScriptName
    nameRecords = FontDetails.nameRecords(forPostScriptName: postScriptName)
    totalGlyphCount = FontDetails.glyphCount(forPostScriptName: postScriptName)
    languages = FontDetails.languages(forPostScriptName: postScriptName)
    fileSize = selectedStyle.fileURL.flatMap { FontDetails.fileSize(at: $0) }
    axes = FontDetails.variationAxes(forPostScriptName: postScriptName)
    features = FontDetails.features(forPostScriptName: postScriptName)
    resetAxes()
    resetFeatures()
    copiedGlyph = nil
    blocks = []
    isLoadingGlyphs = true
    coverages = []
    isLoadingCoverage = true

    glyphTask?.cancel()
    glyphTask = Task { [weak self, glyphCatalog] in
      let loaded = await glyphCatalog.blocks(forPostScriptName: postScriptName)
      guard !Task.isCancelled else { return }
      self?.apply(loaded)
    }

    coverageTask?.cancel()
    coverageTask = Task { [weak self, glyphCatalog] in
      let loaded = await glyphCatalog.coverage(
        forPostScriptName: postScriptName, in: JapaneseCharacterSetCatalog.all)
      guard !Task.isCancelled else { return }
      self?.apply(loaded)
    }
  }

  private func apply(_ loaded: [FontCharacterSetCoverage]) {
    coverages = loaded
    isLoadingCoverage = false
  }

  private func apply(_ loaded: [UnicodeBlockGlyphs]) {
    blocks = loaded
    isLoadingGlyphs = false
    if selectedBlockID == nil || !loaded.contains(where: { $0.id == selectedBlockID }) {
      selectedBlockID = loaded.first?.id
    }
  }

  private func matches(_ glyph: FontGlyph, query: String) -> Bool {
    if query.unicodeScalars.count == 1, query.unicodeScalars.first == glyph.scalar {
      return true
    }
    let normalized = query.uppercased().replacingOccurrences(of: "U+", with: "")
    guard normalized.count >= 2, let value = UInt32(normalized, radix: 16) else { return false }
    return glyph.scalar.value == value
  }

  private func store(_ color: NSColor, forKey key: String) {
    guard let converted = color.usingColorSpace(.sRGB) else { return }
    defaults.set(
      [
        Double(converted.redComponent),
        Double(converted.greenComponent),
        Double(converted.blueComponent),
        Double(converted.alphaComponent),
      ],
      forKey: key
    )
  }

  private static func color(_ components: [Double]?) -> NSColor? {
    guard let components, components.count == 4 else { return nil }
    return NSColor(
      srgbRed: components[0],
      green: components[1],
      blue: components[2],
      alpha: components[3]
    )
  }
}
