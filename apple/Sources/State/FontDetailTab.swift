import Foundation

enum FontDetailTab: String, CaseIterable, Identifiable {
  case info
  case glyphs
  case sample

  var id: String { rawValue }

  var title: String {
    switch self {
    case .info: "情報"
    case .glyphs: "グリフ"
    case .sample: "ためしがき"
    }
  }
}
