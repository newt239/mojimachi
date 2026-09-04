import Foundation

struct FontDuplicateCandidate: Hashable, Sendable, Identifiable {
  let familyName: String
  let style: FontStyle
  let isActive: Bool

  init(familyName: String, style: FontStyle, isActive: Bool = false) {
    self.familyName = familyName
    self.style = style
    self.isActive = isActive
  }

  var id: String {
    "\(style.postScriptName)\u{1}\(style.fileURL?.path(percentEncoded: false) ?? "")"
  }

  var path: String {
    style.fileURL?.path(percentEncoded: false) ?? "ファイルが特定できません"
  }
}
