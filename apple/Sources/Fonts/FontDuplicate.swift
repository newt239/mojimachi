import Foundation

struct FontDuplicate: Hashable, Sendable, Identifiable {
  let postScriptName: String
  let candidates: [FontDuplicateCandidate]

  var id: String { postScriptName }

  var activeCandidate: FontDuplicateCandidate? {
    candidates.first { $0.isActive }
  }

  var isSystemOnly: Bool {
    candidates.allSatisfy { $0.style.isSystemFont }
  }

  var familyNames: [String] {
    var seen: Set<String> = []
    return candidates.map(\.familyName).filter { !$0.isEmpty && seen.insert($0).inserted }
  }
}
