import CoreText
import Foundation

actor FontCatalog {
  private var cachedFamilies: [FontFamily]?

  func families() throws -> [FontFamily] {
    if let cachedFamilies {
      return cachedFamilies
    }
    let families = try Self.enumerateFamilies()
    cachedFamilies = families
    return families
  }

  func families(matching keyword: String, japaneseOnly: Bool) throws -> [FontFamily] {
    let normalizedKeyword = keyword.lowercased()
    return try families().filter { family in
      guard !japaneseOnly || family.supportsJapanese else {
        return false
      }
      return normalizedKeyword.isEmpty || family.searchKey.contains(normalizedKeyword)
    }
  }
}

extension FontCatalog {
  private static let japaneseProbes: [Unicode.Scalar] = ["あ", "ア"]

  static func enumerateFamilies() throws -> [FontFamily] {
    let collection = CTFontCollectionCreateFromAvailableFonts(nil)
    guard
      let descriptors = CTFontCollectionCreateMatchingFontDescriptors(collection)
        as? [CTFontDescriptor]
    else {
      throw FontCatalogError.enumerationFailed
    }

    var stylesByFamily: [String: [FontStyle]] = [:]
    var japaneseByFamily: [String: Bool] = [:]

    for descriptor in descriptors {
      guard let familyName = attribute(descriptor, kCTFontFamilyNameAttribute) as? String,
        !familyName.hasPrefix("."),
        let postScriptName = attribute(descriptor, kCTFontNameAttribute) as? String
      else {
        continue
      }

      let traits = attribute(descriptor, kCTFontTraitsAttribute) as? [String: Any]
      let symbolicTraits = traits?[kCTFontSymbolicTrait as String] as? UInt32 ?? 0

      stylesByFamily[familyName, default: []].append(
        FontStyle(
          postScriptName: postScriptName,
          styleName: attribute(descriptor, kCTFontStyleNameAttribute) as? String ?? "",
          weight: traits?[kCTFontWeightTrait as String] as? Double ?? 0,
          isItalic: symbolicTraits & CTFontSymbolicTraits.traitItalic.rawValue != 0,
          isMonospaced: symbolicTraits & CTFontSymbolicTraits.traitMonoSpace.rawValue != 0,
          fileURL: attribute(descriptor, kCTFontURLAttribute) as? URL,
          format: FontFormat(rawValue: attribute(descriptor, kCTFontFormatAttribute) as? Int ?? 0),
          location: FontLocation(
            priority: attribute(descriptor, kCTFontPriorityAttribute) as? Int ?? 0)
        )
      )

      if japaneseByFamily[familyName] == nil {
        japaneseByFamily[familyName] = supportsJapanese(descriptor)
      }
    }

    return
      stylesByFamily
      .map { familyName, styles in
        FontFamily(
          name: familyName,
          styles: deduplicated(styles),
          supportsJapanese: japaneseByFamily[familyName] ?? false,
          searchKey: familyName.lowercased()
        )
      }
      .sorted { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
  }

  private static func attribute(_ descriptor: CTFontDescriptor, _ key: CFString) -> Any? {
    CTFontDescriptorCopyAttribute(descriptor, key)
  }

  private static func supportsJapanese(_ descriptor: CTFontDescriptor) -> Bool {
    guard let characterSet = attribute(descriptor, kCTFontCharacterSetAttribute) as? CharacterSet
    else {
      return false
    }
    return japaneseProbes.contains { characterSet.contains($0) }
  }

  private static func deduplicated(_ styles: [FontStyle]) -> [FontStyle] {
    var seen: Set<String> = []
    return
      styles
      .filter { seen.insert($0.postScriptName).inserted }
      .sorted { $0.postScriptName.localizedStandardCompare($1.postScriptName) == .orderedAscending }
  }
}
