struct FontFeatureSelector: Hashable, Sendable, Identifiable {
  let identifier: Int
  let name: String
  let isDefault: Bool

  var id: Int { identifier }
}
