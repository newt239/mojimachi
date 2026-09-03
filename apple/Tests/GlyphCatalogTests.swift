import Testing

@testable import Mojimachi

@Suite("グリフ一覧")
struct GlyphCatalogTests {
  @Test("実在するグリフだけを返す")
  func returnsOnlyExistingGlyphs() async {
    let blocks = await GlyphCatalog().blocks(forPostScriptName: "HelveticaNeue")
    let latin = blocks.first { $0.block.name == "基本ラテン" }

    #expect(latin?.glyphs.contains { $0.scalar == "A" } == true)
    #expect(blocks.allSatisfy { !$0.glyphs.isEmpty })
  }

  @Test("収録していないブロックは含めない")
  func omitsUnsupportedBlocks() async {
    let blocks = await GlyphCatalog().blocks(forPostScriptName: "HelveticaNeue")

    #expect(!blocks.contains { $0.block.name == "ひらがな" })
  }

  @Test("和文フォントはひらがなを収録する")
  func includesHiraganaForJapaneseFont() async {
    let blocks = await GlyphCatalog().blocks(forPostScriptName: "HiraginoSans-W3")
    let hiragana = blocks.first { $0.block.name == "ひらがな" }

    #expect(hiragana?.glyphs.contains { $0.scalar == "あ" } == true)
  }

  @Test("存在しないフォントでは空を返す")
  func returnsEmptyForUnknownFont() async {
    #expect(await GlyphCatalog().blocks(forPostScriptName: "存在しないフォント名").isEmpty)
  }

  @Test("コードポイントを表示できる")
  func formatsCodePoint() {
    #expect(FontGlyph(scalar: "A").codePoint == "U+0041")
    #expect(FontGlyph(scalar: "あ").codePoint == "U+3042")
    #expect(FontGlyph(scalar: "\u{1F600}").codePoint == "U+1F600")
  }

  @Test("ブロックの範囲が重ならない")
  func blocksDoNotOverlap() {
    let sorted = UnicodeBlock.all.sorted { $0.range.lowerBound < $1.range.lowerBound }

    for (previous, next) in zip(sorted, sorted.dropFirst()) {
      #expect(previous.range.upperBound < next.range.lowerBound)
    }
  }
}
