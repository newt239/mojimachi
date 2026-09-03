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
    guard let font = makeFont(postScriptName: postScriptName),
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

  static func tag(for identifier: Int) -> String {
    let bytes = (0..<4).reversed().map { UInt8((identifier >> ($0 * 8)) & 0xff) }
    return String(decoding: bytes, as: UTF8.self)
  }

  static func font(
    postScriptName: String,
    size: CGFloat,
    variations: [Int: Double] = [:]
  ) -> CTFont? {
    let descriptor = CTFontDescriptorCreateWithAttributes(
      [kCTFontNameAttribute: postScriptName] as CFDictionary
    )
    let font = CTFontCreateWithFontDescriptor(descriptor, size, nil)
    guard CTFontCopyPostScriptName(font) as String == postScriptName else {
      return nil
    }
    guard !variations.isEmpty else {
      return font
    }
    let settings = Dictionary(
      uniqueKeysWithValues: variations.map { (NSNumber(value: $0.key), $0.value) }
    )
    let varied = CTFontDescriptorCreateWithAttributes(
      [kCTFontVariationAttribute: settings] as CFDictionary
    )
    return CTFontCreateCopyWithAttributes(font, size, nil, varied)
  }

  private static func makeFont(postScriptName: String) -> CTFont? {
    font(postScriptName: postScriptName, size: 0)
  }
}
