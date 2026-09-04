struct FontPrintTarget: Hashable, Sendable, Identifiable {
  let familyName: String
  let postScriptName: String
  let styleName: String

  var id: String { postScriptName }

  var label: String {
    styleName.isEmpty ? familyName : "\(familyName) \(styleName)"
  }
}
