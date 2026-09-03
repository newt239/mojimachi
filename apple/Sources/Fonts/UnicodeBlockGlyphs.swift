import Foundation

struct UnicodeBlockGlyphs: Hashable, Sendable, Identifiable {
  let block: UnicodeBlock
  let glyphs: [FontGlyph]

  var id: UInt32 { block.id }
}
