import CoreText
import Foundation
import Testing

@testable import Mojimachi

@Suite("OpenType 機能")
struct FontFeatureTests {
  @Test("和文フォントは切り替えられる機能を列挙する")
  func listsFeaturesForJapaneseFont() {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")

    #expect(!features.isEmpty)
    #expect(features.allSatisfy { $0.selectors.count > 1 })
  }

  // 20 は AAT の文字形状（異体字）機能。名前は表示言語で変わるため識別子で引く
  private let characterShapeType = 20

  @Test("異体字を切り替える機能を持つ")
  func providesCharacterShapeFeature() throws {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")
    let shape = try #require(features.first { $0.identifier == characterShapeType })

    #expect(shape.isExclusive)
    #expect(shape.selectors.contains { $0.name.contains("JIS1978") })
    #expect(shape.selectors.contains { $0.name.contains("JIS1990") })
  }

  @Test("機能の名前を読み取れる")
  func readsFeatureNames() {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")

    #expect(features.allSatisfy { !$0.name.isEmpty })
    #expect(features.allSatisfy { feature in feature.selectors.allSatisfy { !$0.name.isEmpty } })
  }

  @Test("識別子が負の機能は除外する")
  func skipsFeaturesWithNegativeIdentifier() {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")

    #expect(features.allSatisfy { $0.identifier >= 0 })
  }

  @Test("機能の識別子が重複しない")
  func keepsFeatureIdentifiersUnique() {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")

    #expect(Set(features.map(\.id)).count == features.count)
  }

  @Test("排他的な機能の既定セレクタは高々 1 つ")
  func keepsAtMostOneDefaultSelector() {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")

    #expect(
      features.filter(\.isExclusive).allSatisfy { $0.selectors.filter(\.isDefault).count <= 1 })
  }

  @Test("既定セレクタがなければ先頭を使う")
  func fallsBackToFirstSelector() {
    let feature = FontFeature(
      identifier: 1,
      name: "テスト",
      isExclusive: true,
      selectors: [
        FontFeatureSelector(identifier: 0, name: "A", isDefault: false),
        FontFeatureSelector(identifier: 1, name: "B", isDefault: false),
      ],
      sampleText: nil,
      tooltip: nil
    )

    #expect(feature.defaultSelector?.identifier == 0)
  }

  @Test("存在しないフォントでは空を返す")
  func returnsEmptyForUnknownFont() {
    #expect(FontDetails.features(forPostScriptName: "存在しないフォント名").isEmpty)
  }

  @Test("機能を指定してもフォントを生成できる")
  func buildsFontWithFeatureSettings() throws {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")
    let shape = try #require(features.first { $0.identifier == characterShapeType })
    let selector = try #require(shape.selectors.first { $0.name.contains("JIS1978") })

    let font = try #require(
      FontDetails.font(
        postScriptName: "HiraginoSans-W3",
        size: 24,
        features: [shape.identifier: selector.identifier]
      )
    )

    #expect(CTFontCopyPostScriptName(font) as String == "HiraginoSans-W3")
  }

  @Test("軸と機能を同時に指定できる")
  func buildsFontWithAxesAndFeatures() throws {
    let features = FontDetails.features(forPostScriptName: "HiraginoSans-W3")
    let feature = try #require(features.first)
    let selector = try #require(feature.selectors.first)

    #expect(
      FontDetails.font(
        postScriptName: "HiraginoSans-W3",
        size: 24,
        variations: [0x77676874: 400],
        features: [feature.identifier: selector.identifier]
      ) != nil
    )
  }

  @Test("軸も機能も空なら通常のフォントを返す")
  func returnsPlainFontWithoutSettings() throws {
    let font = try #require(FontDetails.font(postScriptName: "HelveticaNeue", size: 24))

    #expect(CTFontCopyPostScriptName(font) as String == "HelveticaNeue")
  }
}

@Suite("OpenType 機能の選択")
@MainActor
struct FontFeatureSelectionTests {
  private func makeDefaults(_ name: String) throws -> UserDefaults {
    let suiteName = "dev.newt239.mojimachi.tests.\(name)"
    UserDefaults().removePersistentDomain(forName: suiteName)
    return try #require(UserDefaults(suiteName: suiteName))
  }

  private func makeModel(_ name: String) throws -> FontDetailModel {
    let style = FontStyle(
      postScriptName: "HiraginoSans-W3",
      styleName: "W3",
      weight: 0,
      isItalic: false,
      isMonospaced: false,
      fileURL: nil
    )
    let family = FontFamily(
      name: "Hiragino Sans", styles: [style], supportsJapanese: true, searchKey: "hiragino sans")
    let model = FontDetailModel(
      family: family, style: style, defaults: try makeDefaults(name))
    model.load()
    return model
  }

  @Test("読み込むと既定のセレクタが入る")
  func fillsDefaultSelectors() throws {
    let model = try makeModel("feature-defaults")

    #expect(!model.features.isEmpty)
    #expect(model.featureSelections.count == model.features.count)
    #expect(!model.usesCustomFeatures)
  }

  @Test("セレクタを変えると既定から外れたと判定する")
  func detectsCustomSelection() throws {
    let model = try makeModel("feature-custom")
    let feature = try #require(model.features.first { $0.selectors.count > 1 })
    let other = try #require(
      feature.selectors.first { $0.identifier != feature.defaultSelector?.identifier })

    model.featureSelections[feature.identifier] = other.identifier

    #expect(model.usesCustomFeatures)
  }

  @Test("既定値に戻せる")
  func restoresDefaultSelectors() throws {
    let model = try makeModel("feature-reset")
    let feature = try #require(model.features.first { $0.selectors.count > 1 })
    let other = try #require(
      feature.selectors.first { $0.identifier != feature.defaultSelector?.identifier })

    model.featureSelections[feature.identifier] = other.identifier
    model.resetFeatures()

    #expect(!model.usesCustomFeatures)
  }

  @Test("機能の選択は永続化されない")
  func doesNotPersistFeatureSelection() throws {
    let first = try makeModel("feature-persistence")
    let feature = try #require(first.features.first)
    first.featureSelections[feature.identifier] = 999

    let second = try makeModel("feature-persistence")

    #expect(second.featureSelections[feature.identifier] != 999)
  }
}
