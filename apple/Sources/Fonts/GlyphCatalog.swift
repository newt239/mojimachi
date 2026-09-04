import CoreText
import Foundation

actor GlyphCatalog {
  private var cache: [String: [UnicodeBlockGlyphs]] = [:]
  private var coverageCache: [String: [FontCharacterSetCoverage]] = [:]

  func blocks(forPostScriptName postScriptName: String) -> [UnicodeBlockGlyphs] {
    if let cached = cache[postScriptName] {
      return cached
    }
    guard let font = FontDetails.font(postScriptName: postScriptName, size: 0) else {
      return []
    }
    let blocks = UnicodeBlock.all.compactMap { block -> UnicodeBlockGlyphs? in
      let glyphs = Self.glyphs(in: font, block: block)
      return glyphs.isEmpty ? nil : UnicodeBlockGlyphs(block: block, glyphs: glyphs)
    }
    cache[postScriptName] = blocks
    return blocks
  }

  func coverage(
    forPostScriptName postScriptName: String,
    in sets: [JapaneseCharacterSet]
  ) -> [FontCharacterSetCoverage] {
    if let cached = coverageCache[postScriptName] {
      return cached
    }
    guard let font = FontDetails.font(postScriptName: postScriptName, size: 0) else {
      return []
    }
    let coverage = sets.map {
      FontCharacterSetCoverage(
        characterSet: $0, coveredCount: Self.supportedCount($0.scalars, in: font))
    }
    coverageCache[postScriptName] = coverage
    return coverage
  }

  static func supportedCount(_ scalars: [Unicode.Scalar], in font: CTFont) -> Int {
    glyphIdentifiers(for: scalars, in: font).filter { $0 != 0 }.count
  }

  private static func glyphs(in font: CTFont, block: UnicodeBlock) -> [FontGlyph] {
    let scalars = block.range.compactMap(Unicode.Scalar.init)
    return zip(scalars, glyphIdentifiers(for: scalars, in: font)).compactMap { scalar, glyph in
      glyph == 0 ? nil : FontGlyph(scalar: scalar)
    }
  }

  private static func glyphIdentifiers(
    for scalars: [Unicode.Scalar],
    in font: CTFont
  ) -> [CGGlyph] {
    guard !scalars.isEmpty else { return [] }

    var characters: [UniChar] = []
    var positions: [Int] = []

    for scalar in scalars {
      positions.append(characters.count)
      characters.append(contentsOf: String(scalar).utf16)
    }

    var glyphs = [CGGlyph](repeating: 0, count: characters.count)
    _ = CTFontGetGlyphsForCharacters(font, characters, &glyphs, characters.count)

    return positions.map { glyphs[$0] }
  }
}
