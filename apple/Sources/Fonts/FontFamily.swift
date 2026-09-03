import Foundation

struct FontFamily: Hashable, Sendable, Identifiable {
  let name: String
  let styles: [FontStyle]
  let supportsJapanese: Bool
  let searchKey: String

  var id: String { name }

  var representativeStyle: FontStyle? {
    styles.filter { !$0.isItalic }.min { abs($0.weight) < abs($1.weight) } ?? styles.first
  }
}
