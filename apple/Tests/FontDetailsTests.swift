import CoreText
import Foundation
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

  private func shadowedPostScriptName() throws -> String? {
    let collection = CTFontCollectionCreateFromAvailableFonts(nil)
    let descriptors =
      try #require(
        CTFontCollectionCreateMatchingFontDescriptors(collection) as? [CTFontDescriptor])

    var axisCounts: [String: [Int]] = [:]
    for descriptor in descriptors {
      guard
        let postScriptName = CTFontDescriptorCopyAttribute(descriptor, kCTFontNameAttribute)
          as? String
      else { continue }
      let axes =
        CTFontDescriptorCopyAttribute(descriptor, kCTFontVariationAxesAttribute)
        as? [[String: Any]] ?? []
      axisCounts[postScriptName, default: []].append(axes.count)
    }

    return
      axisCounts
      .first { _, counts in counts.contains(0) && counts.contains { $0 > 0 } }?
      .key
  }

  private func coverage(_ font: CTFont) -> Set<UInt32> {
    var result: Set<UInt32> = []
    for value in UInt32(0x20)...UInt32(0x2FFF) {
      guard let scalar = Unicode.Scalar(value) else { continue }
      var characters = Array(String(scalar).utf16)
      var glyphs = [CGGlyph](repeating: 0, count: characters.count)
      _ = CTFontGetGlyphsForCharacters(font, &characters, &glyphs, characters.count)
      if glyphs[0] != 0 {
        result.insert(value)
      }
    }
    return result
  }

  @Test("同名の静的フォントがあっても可変フォントの軸を見つける")
  func findsAxesWhenStaticFaceShadowsVariableFont() throws {
    guard let postScriptName = try shadowedPostScriptName() else { return }

    #expect(!FontDetails.variationAxes(forPostScriptName: postScriptName).isEmpty)
  }

  @Test("軸が既定値のままなら収録字を減らさない")
  func keepsGlyphCoverageAtDefaults() throws {
    guard let postScriptName = try shadowedPostScriptName() else { return }
    let axis = try #require(FontDetails.variationAxes(forPostScriptName: postScriptName).first)

    let base = try #require(FontDetails.font(postScriptName: postScriptName, size: 0))
    let varied = try #require(
      FontDetails.font(
        postScriptName: postScriptName,
        size: 0,
        variations: [axis.identifier: axis.defaultValue]
      )
    )

    #expect(coverage(base).count >= coverage(varied).count)
  }

  @Test("軸の値がフォントに適用される")
  func appliesVariationAxes() async throws {
    let families = try await FontCatalog().families()
    let styles = families.compactMap(\.representativeStyle)

    let target = styles.lazy.compactMap { style -> (String, FontVariationAxis)? in
      guard
        let axis = FontDetails.variationAxes(forPostScriptName: style.postScriptName)
          .first(where: { $0.minimumValue < $0.maximumValue })
      else {
        return nil
      }
      return (style.postScriptName, axis)
    }.first
    let (postScriptName, axis) = try #require(target)

    let font = try #require(
      FontDetails.font(
        postScriptName: postScriptName,
        size: 64,
        variations: [axis.identifier: axis.maximumValue]
      )
    )
    let applied = try #require(CTFontCopyVariation(font) as? [AnyHashable: Any])

    #expect(applied[NSNumber(value: axis.identifier)] as? Double == axis.maximumValue)
  }

  @Test("軸の識別子を 4 文字のタグに変換する")
  func convertsIdentifierToTag() {
    #expect(FontDetails.tag(for: 0x7767_6874) == "wght")
    #expect(FontDetails.tag(for: 0x7764_7468) == "wdth")
    #expect(FontDetails.tag(for: 0x6974_616c) == "ital")
  }
}
