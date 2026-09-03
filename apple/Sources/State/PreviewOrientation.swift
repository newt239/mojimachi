import Foundation

enum PreviewOrientation: String, CaseIterable, Identifiable {
  case horizontal
  case vertical

  var id: String { rawValue }

  var label: String {
    switch self {
    case .horizontal: "横書き"
    case .vertical: "縦書き"
    }
  }

  var symbolName: String {
    switch self {
    case .horizontal: "text.alignleft"
    case .vertical: "character.textbox.ja"
    }
  }
}
