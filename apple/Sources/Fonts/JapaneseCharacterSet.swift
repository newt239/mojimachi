struct JapaneseCharacterSet: Hashable, Sendable, Identifiable {
  let id: String
  let name: String
  let scalars: [Unicode.Scalar]

  var count: Int { scalars.count }
}
