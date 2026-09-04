import CoreText
import Testing

@testable import Mojimachi

@Suite("フォントの種類")
struct FontFormatTests {
  @Test("属性値から種類を判定する")
  func mapsRawValue() {
    #expect(
      FontFormat(rawValue: Int(CTFontFormat.openTypePostScript.rawValue)) == .openTypePostScript)
    #expect(FontFormat(rawValue: Int(CTFontFormat.openTypeTrueType.rawValue)) == .openTypeTrueType)
    #expect(FontFormat(rawValue: Int(CTFontFormat.trueType.rawValue)) == .trueType)
    #expect(FontFormat(rawValue: Int(CTFontFormat.postScript.rawValue)) == .postScript)
    #expect(FontFormat(rawValue: Int(CTFontFormat.bitmap.rawValue)) == .bitmap)
  }

  @Test("未知の値は不明として扱う")
  func fallsBackToUnrecognized() {
    #expect(FontFormat(rawValue: Int(CTFontFormat.unrecognized.rawValue)) == .unrecognized)
    #expect(FontFormat(rawValue: 99) == .unrecognized)
  }
}
