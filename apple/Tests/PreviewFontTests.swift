import CoreText
import Foundation
import Testing

@testable import Mojimachi

@Suite("プレビュー用フォント")
struct PreviewFontTests {
  private func usedFontNames(_ font: CTFont, text: String) -> [String] {
    let attributed = NSAttributedString(
      string: text,
      attributes: [kCTFontAttributeName as NSAttributedString.Key: font]
    )
    let line = CTLineCreateWithAttributedString(attributed)
    guard let runs = CTLineGetGlyphRuns(line) as? [CTRun] else { return [] }
    return runs.compactMap { run in
      guard let attributes = CTRunGetAttributes(run) as? [String: CTFont],
        let used = attributes[kCTFontAttributeName as String]
      else {
        return nil
      }
      return CTFontCopyPostScriptName(used) as String
    }
  }

  @Test("収録していない文字は代替フォントに置き換わらない")
  func doesNotSubstituteMissingGlyphs() throws {
    let font = try #require(PreviewFont.make(postScriptName: "Menlo-Regular", size: 24))

    #expect(usedFontNames(font, text: "あ漢") == ["LastResort"])
  }

  @Test("収録している文字はそのフォントで描画する")
  func keepsCoveredGlyphs() throws {
    let font = try #require(PreviewFont.make(postScriptName: "Menlo-Regular", size: 24))

    #expect(usedFontNames(font, text: "Ag") == ["Menlo-Regular"])
  }

  @Test("存在しないフォントでは nil を返す")
  func returnsNilForUnknownFont() {
    #expect(PreviewFont.make(postScriptName: "存在しないフォント名", size: 24) == nil)
  }
}
