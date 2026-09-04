import Foundation

struct FontFamily: Hashable, Sendable, Identifiable {
  let name: String
  let styles: [FontStyle]
  let supportsJapanese: Bool
  let searchKey: String
  let characterSet: CharacterSet?

  init(
    name: String,
    styles: [FontStyle],
    supportsJapanese: Bool,
    searchKey: String,
    characterSet: CharacterSet? = nil
  ) {
    self.name = name
    self.styles = styles
    self.supportsJapanese = supportsJapanese
    self.searchKey = searchKey
    self.characterSet = characterSet
  }

  var id: String { name }

  var representativeStyle: FontStyle? { style(nearestWeight: 0, italic: false) }

  var hasItalic: Bool { styles.contains { $0.isItalic } }

  func style(nearestWeight weight: Double, italic: Bool) -> FontStyle? {
    let matching = styles.filter { $0.isItalic == italic }
    let candidates = matching.isEmpty ? styles : matching
    return candidates.min { abs($0.weight - weight) < abs($1.weight - weight) }
  }

  func covers(_ scalars: [Unicode.Scalar]) -> Bool {
    guard !scalars.isEmpty else { return true }
    guard let characterSet else { return false }
    return scalars.allSatisfy(characterSet.contains)
  }

  func missing(_ scalars: [Unicode.Scalar]) -> [Unicode.Scalar] {
    guard let characterSet else { return scalars }
    return scalars.filter { !characterSet.contains($0) }
  }

  // 収録文字集合は比較に含めない。ファミリー名がカタログ内で一意なため
  static func == (lhs: FontFamily, rhs: FontFamily) -> Bool {
    lhs.name == rhs.name && lhs.styles == rhs.styles
  }

  func hash(into hasher: inout Hasher) {
    hasher.combine(name)
  }
}
