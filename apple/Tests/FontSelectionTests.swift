import Foundation
import Testing

@testable import Mojimachi

@Suite("フォントの複数選択")
@MainActor
struct FontSelectionTests {
  private func makeDefaults(_ name: String) throws -> UserDefaults {
    let suiteName = "dev.newt239.mojimachi.tests.\(name)"
    UserDefaults().removePersistentDomain(forName: suiteName)
    return try #require(UserDefaults(suiteName: suiteName))
  }

  private func family(_ name: String) -> FontFamily {
    FontFamily(name: name, styles: [], supportsJapanese: false, searchKey: name.lowercased())
  }

  @Test("一覧にない ID は選択から取り除かれる")
  func dropsMissingIdentifiers() {
    #expect(FontBrowserModel.retained(["A", "X"], in: [family("A"), family("B")]) == ["A"])
  }

  @Test("一覧が空なら選択も空になる")
  func clearsSelectionWhenListIsEmpty() {
    #expect(FontBrowserModel.retained(["A"], in: []).isEmpty)
  }

  @Test("選択が空なら空を返す")
  func keepsEmptySelection() {
    #expect(FontBrowserModel.retained([], in: [family("A")]).isEmpty)
  }

  @Test("縦書きに切り替えると選択が解除される")
  func clearsSelectionForVerticalLayout() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("vertical-selection"))
    model.selection = ["A", "B"]
    model.orientation = .vertical

    #expect(model.selection.isEmpty)
  }

  @Test("選択は永続化されない")
  func doesNotPersistSelection() throws {
    let defaults = try makeDefaults("selection-persistence")

    let first = FontBrowserModel(defaults: defaults)
    first.selection = ["A"]

    #expect(FontBrowserModel(defaults: defaults).selection.isEmpty)
  }

  @Test("選択したファミリーをまとめてお気に入りにできる")
  func togglesFavoritesTogether() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("bulk-favorites"))
    let families = [family("A"), family("B")]

    #expect(!model.areAllFavorites(families))
    model.toggleFavorites(families)
    #expect(model.areAllFavorites(families))
    model.toggleFavorites(families)
    #expect(model.favorites.isEmpty)
  }

  @Test("一部だけお気に入りなら残りを追加する")
  func addsRemainingFavorites() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("partial-favorites"))
    let families = [family("A"), family("B")]

    model.toggleFavorites([family("A")])
    model.toggleFavorites(families)

    #expect(model.favorites == ["A", "B"])
  }

  @Test("空の配列はすべてお気に入りとみなさない")
  func treatsEmptySelectionAsNotFavorite() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("empty-favorites"))

    #expect(!model.areAllFavorites([]))
  }
}
