import Foundation

struct FontNameRecord: Hashable, Sendable, Identifiable {
  let label: String
  let value: String

  var id: String { label }
}
