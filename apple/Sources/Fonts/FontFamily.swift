import Foundation

struct FontFamily: Hashable, Sendable, Identifiable {
  let name: String
  let styles: [FontStyle]
  let supportsJapanese: Bool
  let searchKey: String

  var id: String { name }

  var representativeStyle: FontStyle? {
    style(nearestWeight: 0, italic: false)
  }

  var hasItalic: Bool {
    styles.contains { $0.isItalic }
  }

  func style(nearestWeight weight: Double, italic: Bool) -> FontStyle? {
    let matching = styles.filter { $0.isItalic == italic }
    let candidates = matching.isEmpty ? styles : matching
    return candidates.min { abs($0.weight - weight) < abs($1.weight - weight) }
  }
}
