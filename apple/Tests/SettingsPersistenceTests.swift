import Foundation
import Testing

@testable import Mojimachi

@Suite("設定の永続化")
@MainActor
struct SettingsPersistenceTests {
  private func makeDefaults(_ name: String) throws -> UserDefaults {
    let suiteName = "dev.newt239.mojimachi.tests.\(name)"
    UserDefaults().removePersistentDomain(forName: suiteName)
    return try #require(UserDefaults(suiteName: suiteName))
  }

  private func family(_ name: String) -> FontFamily {
    FontFamily(name: name, styles: [], supportsJapanese: false, searchKey: name.lowercased())
  }

  @Test("初回起動では既定値を使う")
  func usesDefaultsOnFirstLaunch() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("first-launch"))

    #expect(model.previewText == FontBrowserModel.presetTexts[0])
    #expect(model.fontSize == 28)
    #expect(model.weight == .regular)
    #expect(model.orientation == .horizontal)
    #expect(model.favorites.isEmpty)
    #expect(!model.isItalic)
    #expect(!model.japaneseOnly)
  }

  @Test("表示設定が再起動後も保持される")
  func restoresPreviewSettings() throws {
    let defaults = try makeDefaults("preview-settings")

    let first = FontBrowserModel(defaults: defaults)
    first.previewText = "永"
    first.fontSize = 72
    first.weight = .bold
    first.isItalic = true
    first.orientation = .vertical
    first.japaneseOnly = true

    let second = FontBrowserModel(defaults: defaults)

    #expect(second.previewText == "永")
    #expect(second.fontSize == 72)
    #expect(second.weight == .bold)
    #expect(second.isItalic)
    #expect(second.orientation == .vertical)
    #expect(second.japaneseOnly)
  }

  @Test("お気に入りが再起動後も保持される")
  func restoresFavorites() throws {
    let defaults = try makeDefaults("favorites")

    let first = FontBrowserModel(defaults: defaults)
    first.toggleFavorite(family("Hiragino Sans"))
    first.toggleFavorite(family("Menlo"))

    let second = FontBrowserModel(defaults: defaults)

    #expect(second.favorites == ["Hiragino Sans", "Menlo"])
  }

  @Test("お気に入りの解除が保存される")
  func persistsFavoriteRemoval() throws {
    let defaults = try makeDefaults("favorite-removal")

    let first = FontBrowserModel(defaults: defaults)
    first.toggleFavorite(family("Menlo"))
    first.toggleFavorite(family("Menlo"))

    let second = FontBrowserModel(defaults: defaults)

    #expect(second.favorites.isEmpty)
  }
}
