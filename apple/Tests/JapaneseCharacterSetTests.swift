import Testing

@testable import Mojimachi

@Suite("日本語の文字集合")
struct JapaneseCharacterSetTests {
  private func characterSet(_ id: String) throws -> JapaneseCharacterSet {
    try #require(JapaneseCharacterSetCatalog.all.first { $0.id == id })
  }

  @Test("4 つの文字集合を用意する")
  func providesFourCharacterSets() {
    #expect(JapaneseCharacterSetCatalog.all.map(\.id) == ["joyo", "jinmeiyo", "jis1", "jis2"])
  }

  @Test("常用漢字は 2136 字ある")
  func countsJoyoKanji() throws {
    #expect(try characterSet("joyo").count == 2136)
  }

  @Test("人名用漢字は 863 字ある")
  func countsJinmeiyoKanji() throws {
    #expect(try characterSet("jinmeiyo").count == 863)
  }

  @Test("JIS 第 1 水準は 2965 字ある")
  func countsJisLevel1() throws {
    #expect(try characterSet("jis1").count == 2965)
  }

  @Test("JIS 第 2 水準は 3390 字ある")
  func countsJisLevel2() throws {
    #expect(try characterSet("jis2").count == 3390)
  }

  @Test("同じ字を 2 度含まない")
  func containsNoDuplicates() {
    for set in JapaneseCharacterSetCatalog.all {
      #expect(Set(set.scalars).count == set.count)
    }
  }

  @Test("常用漢字と人名用漢字は互いに素")
  func keepsJoyoAndJinmeiyoDisjoint() throws {
    let joyo = Set(try characterSet("joyo").scalars)
    let jinmeiyo = Set(try characterSet("jinmeiyo").scalars)

    #expect(joyo.isDisjoint(with: jinmeiyo))
  }

  @Test("JIS 第 1 水準と第 2 水準は互いに素")
  func keepsJisLevelsDisjoint() throws {
    let level1 = Set(try characterSet("jis1").scalars)
    let level2 = Set(try characterSet("jis2").scalars)

    #expect(level1.isDisjoint(with: level2))
  }

  @Test("常用漢字のうち JIS X 0208 にないのは 4 字だけ")
  func listsJoyoKanjiOutsideJis() throws {
    let jis = Set(try characterSet("jis1").scalars).union(try characterSet("jis2").scalars)
    let outside = try characterSet("joyo").scalars.filter { !jis.contains($0) }

    #expect(String(String.UnicodeScalarView(outside)) == "剝塡頰\u{20B9F}")
  }

  @Test("常用漢字表の字体を採用する")
  func usesJoyoKanjiTableForms() throws {
    let joyo = Set(try characterSet("joyo").scalars)

    #expect(joyo.contains("糧"))
    #expect(joyo.contains("\u{20B9F}"))
    #expect(!joyo.contains("叱"))
  }

  @Test("収録率は 0 から 1 の範囲に収まる")
  func keepsRatioWithinBounds() throws {
    let set = try characterSet("joyo")

    #expect(FontCharacterSetCoverage(characterSet: set, coveredCount: 0).ratio == 0)
    #expect(FontCharacterSetCoverage(characterSet: set, coveredCount: set.count).ratio == 1)
  }

  @Test("空の文字集合でも 0 除算しない")
  func survivesEmptyCharacterSet() {
    let empty = JapaneseCharacterSet(id: "empty", name: "空", scalars: [])

    #expect(FontCharacterSetCoverage(characterSet: empty, coveredCount: 0).ratio == 0)
  }

  @Test("足りない字数を数えられる")
  func countsMissingCharacters() throws {
    let set = try characterSet("joyo")

    #expect(FontCharacterSetCoverage(characterSet: set, coveredCount: 2000).missingCount == 136)
  }

  @Test("和文フォントは常用漢字をほぼすべて収録する")
  func coversJoyoKanjiWithJapaneseFont() async throws {
    let coverage = await GlyphCatalog().coverage(
      forPostScriptName: "HiraginoSans-W3", in: JapaneseCharacterSetCatalog.all)

    #expect(try #require(coverage.first { $0.id == "joyo" }).ratio > 0.99)
    #expect(try #require(coverage.first { $0.id == "jis1" }).ratio > 0.99)
  }

  @Test("欧文フォントは常用漢字を収録しない")
  func coversNoJoyoKanjiWithLatinFont() async throws {
    let coverage = await GlyphCatalog().coverage(
      forPostScriptName: "HelveticaNeue", in: JapaneseCharacterSetCatalog.all)

    #expect(try #require(coverage.first { $0.id == "joyo" }).coveredCount == 0)
  }

  @Test("存在しないフォントでは空を返す")
  func returnsEmptyCoverageForUnknownFont() async {
    #expect(
      await GlyphCatalog().coverage(
        forPostScriptName: "存在しないフォント名", in: JapaneseCharacterSetCatalog.all
      ).isEmpty
    )
  }

  @Test("収録数は文字集合の総数を超えない")
  func keepsCoveredCountWithinTotal() async {
    let coverage = await GlyphCatalog().coverage(
      forPostScriptName: "HiraginoSans-W3", in: JapaneseCharacterSetCatalog.all)

    #expect(coverage.allSatisfy { $0.coveredCount <= $0.characterSet.count })
  }
}
