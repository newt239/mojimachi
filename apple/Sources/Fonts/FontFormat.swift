import CoreText
import Foundation

enum FontFormat: Sendable {
  case openTypePostScript
  case openTypeTrueType
  case trueType
  case postScript
  case bitmap
  case unrecognized

  init(rawValue: Int) {
    switch CTFontFormat(rawValue: UInt32(clamping: rawValue)) {
    case .openTypePostScript: self = .openTypePostScript
    case .openTypeTrueType: self = .openTypeTrueType
    case .trueType: self = .trueType
    case .postScript: self = .postScript
    case .bitmap: self = .bitmap
    default: self = .unrecognized
    }
  }

  var label: String {
    switch self {
    case .openTypePostScript: "OpenType (CFF)"
    case .openTypeTrueType: "OpenType (TrueType)"
    case .trueType: "TrueType"
    case .postScript: "PostScript"
    case .bitmap: "ビットマップ"
    case .unrecognized: "不明"
    }
  }
}
