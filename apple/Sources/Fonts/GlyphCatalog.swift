import CoreText
import Foundation

actor GlyphCatalog {
  private var cache: [String: [UnicodeBlockGlyphs]] = [:]

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

  private static func glyphs(in font: CTFont, block: UnicodeBlock) -> [FontGlyph] {
    var characters: [UniChar] = []
    var scalars: [Unicode.Scalar] = []
    var positions: [Int] = []

    for value in block.range {
      guard let scalar = Unicode.Scalar(value) else { continue }
      positions.append(characters.count)
      scalars.append(scalar)
      characters.append(contentsOf: String(scalar).utf16)
    }

    var glyphs = [CGGlyph](repeating: 0, count: characters.count)
    _ = CTFontGetGlyphsForCharacters(font, characters, &glyphs, characters.count)

    return zip(scalars, positions).compactMap { scalar, position in
      glyphs[position] == 0 ? nil : FontGlyph(scalar: scalar)
    }
  }
}
