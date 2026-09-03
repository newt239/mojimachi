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

  private let catalog = FontCatalog()
  private var reloadTask: Task<Void, Never>?

  private(set) var families: [FontFamily] = []
  private(set) var loadState: LoadState = .loading

  var scope: Scope = .all
  var favorites: Set<String> = []
  var scrollTarget: FontFamily.ID?

  var previewText = presetTexts[0]
  var fontSize: Double = 28
  var weight: PreviewWeight = .regular
  var isItalic = false
  var orientation: PreviewOrientation = .horizontal

  var searchText = "" {
    didSet {
      guard searchText != oldValue else { return }
      scheduleReload(debounce: .milliseconds(200))
    }
  }

  var japaneseOnly = false {
    didSet {
      guard japaneseOnly != oldValue else { return }
      scheduleReload(debounce: .zero)
    }
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
