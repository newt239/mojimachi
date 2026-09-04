import AppKit
import Foundation

@MainActor
@Observable
final class FontBrowserModel {
  enum LoadState: Equatable {
    case loading
    case loaded
    case failed(String)
  }

  enum Scope: Hashable {
    case all
    case favorites
    case duplicates
  }

  static let presetTexts = [
    "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら。",
    "いろはにほへと ちりぬるを わかよたれそ つねならむ",
    "The quick brown fox jumps over the lazy dog.",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz",
    "0123456789 ¿?¡! &@ “” «» %*^#$£€¢ ()[]{} .,®©",
  ]

  private enum Key {
    static let favorites = "favorites"
    static let previewText = "previewText"
    static let fontSize = "fontSize"
    static let weight = "weight"
    static let isItalic = "isItalic"
    static let japaneseOnly = "japaneseOnly"
    static let orientation = "orientation"
    static let showsSystemDuplicates = "showsSystemDuplicates"
    static let coverageQuery = "coverageQuery"
  }

  private let catalog = FontCatalog()
  private let exporter = FontExporter()
  private let monitor: FontChangeMonitor
  private let defaults: UserDefaults
  private var reloadTask: Task<Void, Never>?
  private var monitorTask: Task<Void, Never>?

  private(set) var families: [FontFamily] = []
  private(set) var duplicates: [FontDuplicate] = []
  private(set) var loadState: LoadState = .loading

  var scope: Scope = .all
  var exportPlan: FontExportPlan?
  var exportMessage: String?
  var scrollTarget: FontFamily.ID?
  var selection: Set<FontFamily.ID> = []
  var searchText = "" {
    didSet {
      guard searchText != oldValue else { return }
      scheduleReload(debounce: .milliseconds(200))
    }
  }

  var favorites: Set<String> {
    didSet { defaults.set(favorites.sorted(), forKey: Key.favorites) }
  }

  var previewText: String {
    didSet { defaults.set(previewText, forKey: Key.previewText) }
  }

  var fontSize: Double {
    didSet { defaults.set(fontSize, forKey: Key.fontSize) }
  }

  var weight: PreviewWeight {
    didSet { defaults.set(weight.rawValue, forKey: Key.weight) }
  }

  var isItalic: Bool {
    didSet { defaults.set(isItalic, forKey: Key.isItalic) }
  }

  var orientation: PreviewOrientation {
    didSet {
      defaults.set(orientation.rawValue, forKey: Key.orientation)
      if orientation == .vertical {
        selection.removeAll()
      }
    }
  }

  var coverageQuery: String {
    didSet {
      defaults.set(coverageQuery, forKey: Key.coverageQuery)
      coverageScalars = Self.scalars(in: coverageQuery)
    }
  }

  private(set) var coverageScalars: [Unicode.Scalar] = []
  private(set) var isExporting = false

  var showsSystemDuplicates: Bool {
    didSet { defaults.set(showsSystemDuplicates, forKey: Key.showsSystemDuplicates) }
  }

  var japaneseOnly: Bool {
    didSet {
      defaults.set(japaneseOnly, forKey: Key.japaneseOnly)
      guard japaneseOnly != oldValue else { return }
      scheduleReload(debounce: .zero)
    }
  }

  init(defaults: UserDefaults = .standard, monitor: FontChangeMonitor = FontChangeMonitor()) {
    self.defaults = defaults
    self.monitor = monitor
    favorites = Set(defaults.stringArray(forKey: Key.favorites) ?? [])
    previewText = defaults.string(forKey: Key.previewText) ?? Self.presetTexts[0]
    fontSize = defaults.object(forKey: Key.fontSize) as? Double ?? 28
    weight = PreviewWeight(rawValue: defaults.double(forKey: Key.weight)) ?? .regular
    isItalic = defaults.bool(forKey: Key.isItalic)
    japaneseOnly = defaults.bool(forKey: Key.japaneseOnly)
    showsSystemDuplicates = defaults.bool(forKey: Key.showsSystemDuplicates)
    coverageQuery = defaults.string(forKey: Key.coverageQuery) ?? ""
    orientation =
      PreviewOrientation(rawValue: defaults.string(forKey: Key.orientation) ?? "") ?? .horizontal
    coverageScalars = Self.scalars(in: coverageQuery)
  }

  nonisolated static func scalars(in text: String) -> [Unicode.Scalar] {
    var seen: Set<Unicode.Scalar> = []
    return
      text.unicodeScalars
      .filter { !$0.properties.isWhitespace && seen.insert($0).inserted }
      .sorted { $0.value < $1.value }
  }

  var visibleFamilies: [FontFamily] {
    let base: [FontFamily]
    switch scope {
    case .all: base = families
    case .favorites: base = families.filter { favorites.contains($0.name) }
    case .duplicates: return []
    }
    guard !coverageScalars.isEmpty else { return base }
    return base.filter { $0.covers(coverageScalars) }
  }

  var unsupportedScalars: [Unicode.Scalar] {
    coverageScalars.filter { scalar in
      !families.contains { $0.characterSet?.contains(scalar) == true }
    }
  }

  var visibleDuplicates: [FontDuplicate] {
    showsSystemDuplicates ? duplicates : duplicates.filter { !$0.isSystemOnly }
  }

  var favoriteFamilies: [FontFamily] {
    families.filter { favorites.contains($0.name) }
  }

  var selectedFamilies: [FontFamily] {
    visibleFamilies.filter { selection.contains($0.id) }
  }

  nonisolated static func retained(
    _ selection: Set<FontFamily.ID>,
    in families: [FontFamily]
  ) -> Set<FontFamily.ID> {
    selection.intersection(families.map(\.id))
  }

  func load() {
    scheduleReload(debounce: .zero)
    guard monitorTask == nil else { return }
    monitorTask = Task { [weak self, monitor] in
      for await _ in monitor.changes {
        guard let self else { return }
        await catalog.invalidate()
        VariableFontIndex.shared.invalidate()
        scheduleReload(debounce: .milliseconds(300))
      }
    }
  }

  func isFavorite(_ family: FontFamily) -> Bool {
    favorites.contains(family.name)
  }

  func toggleFavorite(_ family: FontFamily) {
    if favorites.contains(family.name) {
      favorites.remove(family.name)
    } else {
      favorites.insert(family.name)
    }
  }

  func style(for family: FontFamily) -> FontStyle? {
    family.style(nearestWeight: weight.rawValue, italic: isItalic)
  }

  func toggleFavorites(_ families: [FontFamily]) {
    let names = families.map(\.name)
    if names.allSatisfy(favorites.contains) {
      favorites.subtract(names)
    } else {
      favorites.formUnion(names)
    }
  }

  func areAllFavorites(_ families: [FontFamily]) -> Bool {
    !families.isEmpty && families.allSatisfy { favorites.contains($0.name) }
  }

  func copyPostScriptNames(_ families: [FontFamily]) {
    let names = families.compactMap { style(for: $0)?.postScriptName }
    guard !names.isEmpty else { return }
    NSPasteboard.general.clearContents()
    NSPasteboard.general.setString(names.joined(separator: "\n"), forType: .string)
  }

  func revealInFinder(_ url: URL) {
    NSWorkspace.shared.activateFileViewerSelecting([url])
  }

  func revealInFinder(_ families: [FontFamily]) {
    let urls = families.compactMap { style(for: $0)?.fileURL }
    guard !urls.isEmpty else { return }
    NSWorkspace.shared.activateFileViewerSelecting(urls)
  }

  func families(for ids: Set<FontFamily.ID>) -> [FontFamily] {
    visibleFamilies.filter { ids.contains($0.id) }
  }

  func prepareExport(_ families: [FontFamily]) {
    exportPlan = FontExporter.plan(for: families)
  }

  func cancelExport() {
    exportPlan = nil
  }

  func confirmExport() {
    guard let plan = exportPlan else { return }
    exportPlan = nil
    guard let directory = chooseExportDirectory() else { return }

    isExporting = true
    Task { [exporter] in
      let result = await exporter.export(plan, to: directory)
      isExporting = false
      exportMessage = result.summary
    }
  }

  private func chooseExportDirectory() -> URL? {
    let panel = NSOpenPanel()
    panel.canChooseFiles = false
    panel.canChooseDirectories = true
    panel.allowsMultipleSelection = false
    panel.canCreateDirectories = true
    panel.prompt = "書き出す"
    panel.message = "フォントの書き出し先フォルダを選んでください"
    return panel.runModal() == .OK ? panel.url : nil
  }

  private func scheduleReload(debounce: Duration) {
    reloadTask?.cancel()
    reloadTask = Task { [weak self] in
      if debounce > .zero {
        try? await Task.sleep(for: debounce)
      }
      guard !Task.isCancelled else { return }
      await self?.reload()
    }
  }

  private func reload() async {
    do {
      families = try await catalog.families(matching: searchText, japaneseOnly: japaneseOnly)
      duplicates = try await catalog.duplicates()
      selection = Self.retained(selection, in: families)
      loadState = .loaded
    } catch {
      loadState = .failed(error.localizedDescription)
    }
  }
}
