import Foundation
import Testing

@testable import Mojimachi

@Suite("収録文字での絞り込み")
struct FontCoverageFilterTests {
  private func family(_ name: String, covering text: String?) -> FontFamily {
    FontFamily(
      name: name,
      styles: [],
      supportsJapanese: false,
      searchKey: name.lowercased(),
      characterSet: text.map { CharacterSet(charactersIn: $0) }
    )
  }

  private func scalars(_ text: String) -> [Unicode.Scalar] {
    FontBrowserModel.scalars(in: text)
  }

  @Test("すべての文字を収録していれば残る")
  func keepsFamilyCoveringEveryScalar() {
    #expect(family("A", covering: "森鷗外").covers(scalars("森鷗外")))
  }

  @Test("1 文字でも欠ければ外れる")
  func dropsFamilyMissingAnyScalar() {
    #expect(!family("A", covering: "森外").covers(scalars("森鷗外")))
  }

  @Test("収録文字を読み取れないフォントは外れる")
  func dropsFamilyWithoutCharacterSet() {
    #expect(!family("A", covering: nil).covers(scalars("森")))
  }

  @Test("要求が空ならすべて残る")
  func keepsEveryFamilyForEmptyRequest() {
    #expect(family("A", covering: "あ").covers([]))
    #expect(family("A", covering: nil).covers([]))
  }

  @Test("足りない文字だけを返す")
  func reportsMissingScalars() {
    let missing = family("A", covering: "森外").missing(scalars("森鷗外"))

    #expect(missing.map(String.init) == ["鷗"])
  }

  @Test("収録文字を読み取れなければ全文字が足りない扱いになる")
  func reportsEverythingMissingWithoutCharacterSet() {
    #expect(family("A", covering: nil).missing(scalars("森鷗外")).count == 3)
  }

  @Test("空白と改行を無視する")
  func ignoresWhitespace() {
    #expect(scalars(" 森 鷗\n外\t").map(String.init).sorted() == ["外", "森", "鷗"].sorted())
  }

  @Test("同じ文字を 1 つに畳む")
  func collapsesRepeatedScalars() {
    #expect(scalars("森森森").count == 1)
  }

  @Test("コードポイントの昇順に並ぶ")
  func sortsByCodePoint() {
    let sorted = scalars("鷗森外")

    #expect(sorted == sorted.sorted { $0.value < $1.value })
  }

  @Test("サロゲートペアを 1 文字として扱う")
  func treatsSurrogatePairAsSingleScalar() throws {
    let emoji = scalars("\u{1F600}")

    #expect(emoji.count == 1)
    #expect(try #require(emoji.first).value == 0x1F600)
  }

  @Test("実機では鷗を収録するフォントだけが残る")
  func filtersRealFontsByRareKanji() throws {
    let families = try FontCatalog.scanAvailableFonts().families
    let required = scalars("鷗")

    let hiragino = try #require(families.first { $0.name == "Hiragino Sans" })
    let menlo = try #require(families.first { $0.name == "Menlo" })

    #expect(hiragino.covers(required))
    #expect(!menlo.covers(required))
  }

  @Test("実機のファミリーは収録文字を読み取れる")
  func readsCharacterSetForRealFonts() throws {
    let families = try FontCatalog.scanAvailableFonts().families
    let readable = families.filter { $0.characterSet != nil }

    #expect(Double(readable.count) / Double(families.count) > 0.9)
  }
}
