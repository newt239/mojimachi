import Foundation

struct FontVariationAxis: Hashable, Sendable, Identifiable {
  let identifier: Int
  let name: String
  let minimumValue: Double
  let maximumValue: Double
  let defaultValue: Double

  var id: Int { identifier }
}
