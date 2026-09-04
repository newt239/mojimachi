struct FontFeature: Hashable, Sendable, Identifiable {
  let identifier: Int
  let name: String
  let isExclusive: Bool
  let selectors: [FontFeatureSelector]
  let sampleText: String?
  let tooltip: String?

  var id: Int { identifier }

  var defaultSelector: FontFeatureSelector? {
    selectors.first { $0.isDefault } ?? selectors.first
  }
}
