import Foundation
import Testing

@testable import Mojimachi

@Suite("フォントの比較")
@MainActor
struct FontComparisonTests {
  private func makeDefaults(_ name: String) throws -> UserDefaults {
    let suiteName = "dev.newt239.mojimachi.tests.\(name)"
    UserDefaults().removePersistentDomain(forName: suiteName)
    return try #require(UserDefaults(suiteName: suiteName))
  }

  private func family(_ name: String) -> FontFamily {
    FontFamily(name: name, styles: [], supportsJapanese: false, searchKey: name.lowercased())
  }

  @Test("同じ書体の並びなら等しい")
  func comparesEqualWhenNamesMatch() {
    #expect(FontComparison(familyNames: ["A", "B"]) == FontComparison(familyNames: ["A", "B"]))
  }

  @Test("並び順が違えば別の比較になる")
  func distinguishesOrder() {
    #expect(FontComparison(familyNames: ["A", "B"]) != FontComparison(familyNames: ["B", "A"]))
  }

  @Test("集合に入れて一意になる")
  func staysUniqueInSet() {
    let comparisons: Set = [
      FontComparison(familyNames: ["A", "B"]),
      FontComparison(familyNames: ["A", "B"]),
    ]

    #expect(comparisons.count == 1)
  }

  @Test("1 書体では比較できない")
  func rejectsSingleFamily() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("compare-single"))

    #expect(!model.canCompare([family("A")]))
    #expect(!model.canCompare([]))
  }

  @Test("2 書体から比較できる")
  func acceptsTwoFamilies() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("compare-pair"))

    #expect(model.canCompare([family("A"), family("B")]))
  }

  @Test("5 書体以上でも先頭 4 書体で比較する")
  func limitsComparisonToFourFamilies() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("compare-limit"))
    let families = ["A", "B", "C", "D", "E", "F"].map(family)

    #expect(model.canCompare(families))
    #expect(model.comparison(for: families).familyNames == ["A", "B", "C", "D"])
  }

  @Test("名前からファミリーを引き直せる")
  func resolvesFamiliesByName() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("compare-resolve"))

    #expect(model.families(named: ["A", "B"]).isEmpty)
  }

  @Test("表示モードの既定は並べて表示")
  func defaultsToStackedMode() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("compare-default-mode"))

    #expect(model.comparisonMode == .stacked)
  }

  @Test("表示モードが再起動後も保持される")
  func restoresComparisonMode() throws {
    let defaults = try makeDefaults("compare-mode-persistence")

    let first = FontBrowserModel(defaults: defaults)
    first.comparisonMode = .onion

    #expect(FontBrowserModel(defaults: defaults).comparisonMode == .onion)
  }

  @Test("縦書きに切り替えると選択が消えて比較を始められない")
  func clearsSelectionForVerticalLayout() throws {
    let model = FontBrowserModel(defaults: try makeDefaults("compare-vertical"))

    model.selection = ["A", "B"]
    model.orientation = .vertical

    #expect(model.selectedFamilies.isEmpty)
    #expect(!model.canCompare(model.selectedFamilies))
  }
}
