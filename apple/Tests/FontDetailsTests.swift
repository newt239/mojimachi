import Testing

@testable import Mojimachi

@Suite("フォント詳細")
struct FontDetailsTests {
  @Test("name テーブルを読み出せる")
  func readsNameRecords() async throws {
    let families = try await FontCatalog().families()
    let style = try #require(families.compactMap(\.representativeStyle).first)

    let records = FontDetails.nameRecords(forPostScriptName: style.postScriptName)

    #expect(!records.isEmpty)
    #expect(records.allSatisfy { !$0.value.isEmpty })
    #expect(Set(records.map(\.label)).count == records.count)
  }

  @Test("存在しないフォントでは空を返す")
  func returnsEmptyForUnknownFont() {
    #expect(FontDetails.nameRecords(forPostScriptName: "存在しないフォント名").isEmpty)
    #expect(FontDetails.variationAxes(forPostScriptName: "存在しないフォント名").isEmpty)
  }

  @Test("可変フォントの軸が範囲内の既定値を持つ")
  func variationAxesHaveValidDefaults() async throws {
    let families = try await FontCatalog().families()
    let styles = families.compactMap(\.representativeStyle).prefix(200)

    for style in styles {
      for axis in FontDetails.variationAxes(forPostScriptName: style.postScriptName) {
        #expect(axis.minimumValue <= axis.defaultValue)
        #expect(axis.defaultValue <= axis.maximumValue)
        #expect(!axis.name.isEmpty)
      }
    }
  }

  @Test("軸の識別子を 4 文字のタグに変換する")
  func convertsIdentifierToTag() {
    #expect(FontDetails.tag(for: 0x7767_6874) == "wght")
    #expect(FontDetails.tag(for: 0x7764_7468) == "wdth")
    #expect(FontDetails.tag(for: 0x6974_616c) == "ital")
  }
}
