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
  }

  private let catalog = FontCatalog()
  private let monitor: FontChangeMonitor
  private let defaults: UserDefaults
  private var reloadTask: Task<Void, Never>?
  private var monitorTask: Task<Void, Never>?

  private(set) var families: [FontFamily] = []
  private(set) var loadState: LoadState = .loading

  var scope: Scope = .all
  var scrollTarget: FontFamily.ID?
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
    didSet { defaults.set(orientation.rawValue, forKey: Key.orientation) }
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
    orientation =
      PreviewOrientation(rawValue: defaults.string(forKey: Key.orientation) ?? "") ?? .horizontal
  }

  var visibleFamilies: [FontFamily] {
    switch scope {
    case .all: families
    case .favorites: families.filter { favorites.contains($0.name) }
    }
  }

  var favoriteFamilies: [FontFamily] {
    families.filter { favorites.contains($0.name) }
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
      loadState = .loaded
    } catch {
      loadState = .failed(error.localizedDescription)
    }
  }
}
