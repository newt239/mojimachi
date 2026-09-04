import CoreText
import Foundation

actor FontCatalog {
  private var cachedScan: FontCatalogScan?

  func invalidate() {
    cachedScan = nil
  }

  func families() throws -> [FontFamily] {
    try scan().families
  }

  func duplicates() throws -> [FontDuplicate] {
    try scan().duplicates
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

  private func scan() throws -> FontCatalogScan {
    if let cachedScan {
      return cachedScan
    }
    let scan = try Self.scanAvailableFonts()
    cachedScan = scan
    return scan
  }
}

extension FontCatalog {
  private static let japaneseProbes: [Unicode.Scalar] = ["あ", "ア"]

  static func enumerateFamilies() throws -> [FontFamily] {
    try scanAvailableFonts().families
  }

  static func scanAvailableFonts() throws -> FontCatalogScan {
    let collection = CTFontCollectionCreateFromAvailableFonts(nil)
    guard
      let descriptors = CTFontCollectionCreateMatchingFontDescriptors(collection)
        as? [CTFontDescriptor]
    else {
      throw FontCatalogError.enumerationFailed
    }

    var stylesByFamily: [String: [FontStyle]] = [:]
    var japaneseByFamily: [String: Bool] = [:]
    var candidates: [FontDuplicateCandidate] = []

    for descriptor in descriptors {
      guard let postScriptName = attribute(descriptor, kCTFontNameAttribute) as? String else {
        continue
      }

      let familyName = attribute(descriptor, kCTFontFamilyNameAttribute) as? String ?? ""
      let traits = attribute(descriptor, kCTFontTraitsAttribute) as? [String: Any]
      let symbolicTraits = traits?[kCTFontSymbolicTrait as String] as? UInt32 ?? 0

      let style = FontStyle(
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

      candidates.append(FontDuplicateCandidate(familyName: familyName, style: style))

      guard !familyName.isEmpty, !familyName.hasPrefix(".") else {
        continue
      }

      stylesByFamily[familyName, default: []].append(style)

      if japaneseByFamily[familyName] == nil {
        japaneseByFamily[familyName] = supportsJapanese(descriptor)
      }
    }

    let families =
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

    return FontCatalogScan(families: families, duplicates: duplicates(from: candidates))
  }

  static func duplicates(from candidates: [FontDuplicateCandidate]) -> [FontDuplicate] {
    var grouped: [String: [FontDuplicateCandidate]] = [:]
    for candidate in candidates {
      grouped[candidate.style.postScriptName, default: []].append(candidate)
    }

    return
      grouped
      .compactMap { postScriptName, group -> FontDuplicate? in
        var seenPaths: Set<String> = []
        let distinct = group.filter { seenPaths.insert($0.path).inserted }
        guard distinct.count > 1 else {
          return nil
        }
        let ordered = distinct.sorted { resolutionOrder($0.style) < resolutionOrder($1.style) }
        return FontDuplicate(
          postScriptName: postScriptName,
          candidates: ordered.enumerated().map { index, candidate in
            FontDuplicateCandidate(
              familyName: candidate.familyName,
              style: candidate.style,
              isActive: index == 0
            )
          }
        )
      }
      .sorted { $0.postScriptName.localizedStandardCompare($1.postScriptName) == .orderedAscending }
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

  static func deduplicated(_ styles: [FontStyle]) -> [FontStyle] {
    var seen: Set<String> = []
    return
      styles
      .sorted { resolutionOrder($0) < resolutionOrder($1) }
      .filter { seen.insert($0.postScriptName).inserted }
      .sorted { $0.postScriptName.localizedStandardCompare($1.postScriptName) == .orderedAscending }
  }

  static func resolutionOrder(_ style: FontStyle) -> (Int, String) {
    (-style.location.priority, style.fileURL?.path(percentEncoded: false) ?? "")
  }
}
