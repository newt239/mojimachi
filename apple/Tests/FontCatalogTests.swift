import Testing

@testable import Mojimachi

@Suite("フォントカタログ")
struct FontCatalogTests {
  @Test("インストール済みのフォントを列挙できる")
  func enumeratesInstalledFonts() async throws {
    let families = try await FontCatalog().families()

    #expect(!families.isEmpty)
    #expect(families.allSatisfy { !$0.styles.isEmpty })
  }

  @Test("システム内部のフォントを除外する")
  func excludesSystemInternalFonts() async throws {
    let families = try await FontCatalog().families()

    #expect(families.allSatisfy { !$0.name.hasPrefix(".") })
  }

  @Test("ファミリー名が重複せず昇順に並ぶ")
  func familiesAreUniqueAndSorted() async throws {
    let families = try await FontCatalog().families()
    let names = families.map(\.name)

    #expect(Set(names).count == names.count)
    #expect(names == names.sorted { $0.localizedStandardCompare($1) == .orderedAscending })
  }

  @Test("ファミリー内で PostScript 名が重複しない")
  func stylesAreUniqueWithinFamily() async throws {
    let families = try await FontCatalog().families()

    for family in families {
      let postScriptNames = family.styles.map(\.postScriptName)
      #expect(Set(postScriptNames).count == postScriptNames.count)
    }
  }

  @Test("検索が大文字小文字を区別しない")
  func searchIgnoresCase() async throws {
    let catalog = FontCatalog()
    let family = try #require(await catalog.families().first)

    let lowercased = try await catalog.families(
      matching: family.name.lowercased(), japaneseOnly: false)
    let uppercased = try await catalog.families(
      matching: family.name.uppercased(), japaneseOnly: false)

    #expect(lowercased.contains(family))
    #expect(uppercased.contains(family))
  }

  @Test("検索は部分一致する")
  func searchMatchesPartially() async throws {
    let catalog = FontCatalog()
    let family = try #require(await catalog.families().first { $0.name.count >= 4 })
    let fragment = String(family.name.dropFirst().dropLast())

    let matched = try await catalog.families(matching: fragment, japaneseOnly: false)

    #expect(matched.contains(family))
  }

  @Test("空のキーワードは絞り込まない")
  func emptyKeywordReturnsEverything() async throws {
    let catalog = FontCatalog()
    let all = try await catalog.families()

    let matched = try await catalog.families(matching: "", japaneseOnly: false)

    #expect(matched.count == all.count)
  }

  @Test("日本語フィルタが日本語フォントだけを返す")
  func japaneseFilterSelectsJapaneseFamilies() async throws {
    let catalog = FontCatalog()
    let japanese = try await catalog.families(matching: "", japaneseOnly: true)
    let all = try await catalog.families()

    #expect(!japanese.isEmpty)
    #expect(japanese.count < all.count)
    #expect(japanese.allSatisfy { $0.supportsJapanese })
  }

  @Test("2 回目の取得が同じ結果を返す")
  func repeatedLoadReturnsSameResult() async throws {
    let catalog = FontCatalog()

    let first = try await catalog.families()
    let second = try await catalog.families()

    #expect(first == second)
  }

  @Test("代表スタイルは斜体以外から選ばれる")
  func representativeStyleAvoidsItalic() async throws {
    let families = try await FontCatalog().families()

    for family in families where family.styles.contains(where: { !$0.isItalic }) {
      let representative = try #require(family.representativeStyle)
      #expect(!representative.isItalic)
    }
  }
}
