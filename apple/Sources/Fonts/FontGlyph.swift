import Foundation

struct FontGlyph: Hashable, Sendable, Identifiable {
  let scalar: Unicode.Scalar

  var id: UInt32 { scalar.value }

  var text: String {
    String(Character(scalar))
  }

  var codePoint: String {
    String(format: "U+%04X", scalar.value)
  }
}
