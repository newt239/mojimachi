import CoreText
import Foundation

enum FontDetails {
  private static var nameKeys: [(key: CFString, label: String)] {
    [
      (kCTFontFullNameKey, "フルネーム"),
      (kCTFontFamilyNameKey, "ファミリー名"),
      (kCTFontSubFamilyNameKey, "サブファミリー名"),
      (kCTFontStyleNameKey, "スタイル名"),
      (kCTFontPostScriptNameKey, "PostScript 名"),
      (kCTFontUniqueNameKey, "識別子"),
      (kCTFontVersionNameKey, "バージョン"),
      (kCTFontDesignerNameKey, "デザイナー"),
      (kCTFontManufacturerNameKey, "製造元"),
      (kCTFontCopyrightNameKey, "著作権表示"),
      (kCTFontTrademarkNameKey, "商標"),
      (kCTFontDescriptionNameKey, "説明"),
      (kCTFontLicenseNameKey, "ライセンス"),
      (kCTFontLicenseURLNameKey, "ライセンス URL"),
      (kCTFontVendorURLNameKey, "ベンダー URL"),
      (kCTFontDesignerURLNameKey, "デザイナー URL"),
      (kCTFontSampleTextNameKey, "サンプルテキスト"),
    ]
  }

  static func nameRecords(forPostScriptName postScriptName: String) -> [FontNameRecord] {
    guard let font = makeFont(postScriptName: postScriptName) else {
      return []
    }
    return nameKeys.compactMap { key, label in
      guard let value = CTFontCopyName(font, key) as String?, !value.isEmpty else {
        return nil
      }
      return FontNameRecord(label: label, value: value)
    }
  }

  static func variationAxes(forPostScriptName postScriptName: String) -> [FontVariationAxis] {
    guard
      let font = variableFont(postScriptName: postScriptName, size: 0)
        ?? registeredFont(postScriptName: postScriptName, size: 0),
      let axes = CTFontCopyVariationAxes(font) as? [[String: Any]]
    else {
      return []
    }
    return axes.compactMap { axis in
      guard let identifier = axis[kCTFontVariationAxisIdentifierKey as String] as? Int,
        let minimumValue = axis[kCTFontVariationAxisMinimumValueKey as String] as? Double,
        let maximumValue = axis[kCTFontVariationAxisMaximumValueKey as String] as? Double,
        let defaultValue = axis[kCTFontVariationAxisDefaultValueKey as String] as? Double
      else {
        return nil
      }
      return FontVariationAxis(
        identifier: identifier,
        name: axis[kCTFontVariationAxisNameKey as String] as? String ?? tag(for: identifier),
        minimumValue: minimumValue,
        maximumValue: maximumValue,
        defaultValue: defaultValue
      )
    }
  }

  static func features(forPostScriptName postScriptName: String) -> [FontFeature] {
    guard let font = makeFont(postScriptName: postScriptName),
      let features = CTFontCopyFeatures(font) as? [[String: Any]]
    else {
      return []
    }

    return features.compactMap { feature in
      guard let identifier = feature[kCTFontFeatureTypeIdentifierKey as String] as? Int,
        let rawSelectors = feature[kCTFontFeatureTypeSelectorsKey as String] as? [[String: Any]]
      else {
        return nil
      }

      let selectors = rawSelectors.compactMap { selector -> FontFeatureSelector? in
        guard
          let selectorID = selector[kCTFontFeatureSelectorIdentifierKey as String] as? Int,
          let name = selector[kCTFontFeatureSelectorNameKey as String] as? String
        else {
          return nil
        }
        return FontFeatureSelector(
          identifier: selectorID,
          name: name,
          isDefault: selector[kCTFontFeatureSelectorDefaultKey as String] as? Bool ?? false
        )
      }

      guard identifier >= 0, selectors.count > 1 else {
        return nil
      }

      return FontFeature(
        identifier: identifier,
        // 機能の識別子は 4 文字タグではなく AAT の連番なのでタグに変換しない
        name: feature[kCTFontFeatureTypeNameKey as String] as? String ?? "機能 \(identifier)",
        isExclusive: feature[kCTFontFeatureTypeExclusiveKey as String] as? Bool ?? false,
        selectors: selectors,
        sampleText: feature[kCTFontFeatureSampleTextKey as String] as? String,
        tooltip: feature[kCTFontFeatureTooltipTextKey as String] as? String
      )
    }
  }

  static func glyphCount(forPostScriptName postScriptName: String) -> Int {
    guard let font = makeFont(postScriptName: postScriptName) else {
      return 0
    }
    return CTFontGetGlyphCount(font)
  }

  static func languages(forPostScriptName postScriptName: String) -> [String] {
    guard let font = makeFont(postScriptName: postScriptName) else {
      return []
    }
    let descriptor = CTFontCopyFontDescriptor(font)
    return CTFontDescriptorCopyAttribute(descriptor, kCTFontLanguagesAttribute) as? [String] ?? []
  }

  static func fileSize(at url: URL) -> Int? {
    try? url.resourceValues(forKeys: [.fileSizeKey]).fileSize
  }

  static func tag(for identifier: Int) -> String {
    let bytes = (0..<4).reversed().map { UInt8((identifier >> ($0 * 8)) & 0xff) }
    return String(decoding: bytes, as: UTF8.self)
  }

  static func font(
    postScriptName: String,
    size: CGFloat,
    variations: [Int: Double] = [:],
    features: [Int: Int] = [:]
  ) -> CTFont? {
    guard !variations.isEmpty || !features.isEmpty else {
      return registeredFont(postScriptName: postScriptName, size: size)
    }
    guard
      let font = variableFont(postScriptName: postScriptName, size: size)
        ?? registeredFont(postScriptName: postScriptName, size: size)
    else {
      return nil
    }

    var attributes: [CFString: Any] = [:]

    if !variations.isEmpty {
      attributes[kCTFontVariationAttribute] = Dictionary(
        uniqueKeysWithValues: variations.map { (NSNumber(value: $0.key), $0.value) }
      )
    }

    if !features.isEmpty {
      attributes[kCTFontFeatureSettingsAttribute] = features.map {
        [
          kCTFontFeatureTypeIdentifierKey as String: $0.key,
          kCTFontFeatureSelectorIdentifierKey as String: $0.value,
        ]
      }
    }

    let descriptor = CTFontDescriptorCreateWithAttributes(attributes as CFDictionary)
    return CTFontCreateCopyWithAttributes(font, size, nil, descriptor)
  }

  private static func registeredFont(postScriptName: String, size: CGFloat) -> CTFont? {
    let query = CTFontDescriptorCreateWithAttributes(
      [kCTFontNameAttribute: postScriptName] as CFDictionary
    )
    let font = CTFontCreateWithFontDescriptor(query, size, nil)
    return CTFontCopyPostScriptName(font) as String == postScriptName ? font : nil
  }

  private static func variableFont(postScriptName: String, size: CGFloat) -> CTFont? {
    guard let descriptor = VariableFontIndex.shared.descriptor(forPostScriptName: postScriptName)
    else {
      return nil
    }
    let font = CTFontCreateWithFontDescriptor(descriptor, size, nil)
    return CTFontCopyPostScriptName(font) as String == postScriptName ? font : nil
  }

  private static func makeFont(postScriptName: String) -> CTFont? {
    registeredFont(postScriptName: postScriptName, size: 0)
  }
}
