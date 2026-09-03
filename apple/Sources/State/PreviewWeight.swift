import Foundation

enum PreviewWeight: Double, CaseIterable, Identifiable {
  case thin = -0.6
  case light = -0.4
  case regular = 0
  case medium = 0.23
  case bold = 0.4
  case black = 0.62

  var id: Double { rawValue }

  var label: String {
    switch self {
    case .thin: "極細"
    case .light: "細字"
    case .regular: "標準"
    case .medium: "中字"
    case .bold: "太字"
    case .black: "極太"
    }
  }
}
