import Foundation

struct FontStyle: Hashable, Sendable, Identifiable {
  let postScriptName: String
  let styleName: String
  let weight: Double
  let isItalic: Bool
  let isMonospaced: Bool
  let fileURL: URL?

  var id: String { postScriptName }
}
