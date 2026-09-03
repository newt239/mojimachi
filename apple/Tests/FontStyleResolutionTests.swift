import Testing

@testable import Mojimachi

@Suite("スタイルの解決")
struct FontStyleResolutionTests {
  private func style(_ name: String, weight: Double, italic: Bool = false) -> FontStyle {
    FontStyle(
      postScriptName: name,
      styleName: name,
      weight: weight,
      isItalic: italic,
      isMonospaced: false,
      fileURL: nil
    )
  }

  private func family(_ styles: [FontStyle]) -> FontFamily {
    FontFamily(name: "Sample", styles: styles, supportsJapanese: false, searchKey: "sample")
  }

  @Test("要求したウエイトに最も近いスタイルを選ぶ")
  func picksNearestWeight() {
    let target = family([
      style("Light", weight: -0.4),
      style("Regular", weight: 0),
      style("Bold", weight: 0.4),
    ])

    #expect(target.style(nearestWeight: 0.35, italic: false)?.styleName == "Bold")
    #expect(target.style(nearestWeight: -0.3, italic: false)?.styleName == "Light")
    #expect(target.style(nearestWeight: 0.1, italic: false)?.styleName == "Regular")
  }

  @Test("斜体を要求したら斜体のスタイルから選ぶ")
  func prefersItalicWhenRequested() {
    let target = family([
      style("Regular", weight: 0),
      style("Bold", weight: 0.4),
      style("Italic", weight: 0, italic: true),
    ])

    #expect(target.style(nearestWeight: 0.4, italic: true)?.styleName == "Italic")
    #expect(target.hasItalic)
  }

  @Test("斜体がないファミリーは通常のスタイルにフォールバックする")
  func fallsBackWhenItalicIsMissing() {
    let target = family([style("Regular", weight: 0), style("Bold", weight: 0.4)])

    #expect(!target.hasItalic)
    #expect(target.style(nearestWeight: 0.4, italic: true)?.styleName == "Bold")
  }

  @Test("代表スタイルは標準ウエイトの非斜体になる")
  func representativeStyleIsUprightRegular() {
    let target = family([
      style("Italic", weight: 0, italic: true),
      style("Bold", weight: 0.4),
      style("Regular", weight: 0),
    ])

    #expect(target.representativeStyle?.styleName == "Regular")
  }

  @Test("スタイルがなければ nil を返す")
  func returnsNilWithoutStyles() {
    let target = family([])

    #expect(target.style(nearestWeight: 0, italic: false) == nil)
    #expect(target.representativeStyle == nil)
  }
}
