import Foundation

struct FontStyle: Hashable, Sendable, Identifiable {
  let postScriptName: String
  let styleName: String
  let weight: Double
  let isItalic: Bool
  let isMonospaced: Bool
  let fileURL: URL?
  let format: FontFormat
  let location: FontLocation

  var id: String { postScriptName }

  init(
    postScriptName: String,
    styleName: String,
    weight: Double,
    isItalic: Bool,
    isMonospaced: Bool,
    fileURL: URL?,
    format: FontFormat = .unrecognized,
    location: FontLocation = .unknown
  ) {
    self.postScriptName = postScriptName
    self.styleName = styleName
    self.weight = weight
    self.isItalic = isItalic
    self.isMonospaced = isMonospaced
    self.fileURL = fileURL
    self.format = format
    self.location = location
  }
}
