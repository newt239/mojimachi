import CoreText
import Foundation

enum FontLocation: Sendable {
  case system
  case network
  case computer
  case user
  case dynamic
  case process
  case unknown

  init(priority: Int) {
    switch priority {
    case Int(kCTFontPrioritySystem): self = .system
    case Int(kCTFontPriorityNetwork): self = .network
    case Int(kCTFontPriorityComputer): self = .computer
    case Int(kCTFontPriorityUser): self = .user
    case Int(kCTFontPriorityDynamic): self = .dynamic
    case Int(kCTFontPriorityProcess): self = .process
    default: self = .unknown
    }
  }

  var label: String {
    switch self {
    case .system: "システム"
    case .network: "ネットワーク"
    case .computer: "このコンピュータ"
    case .user: "ユーザ"
    case .dynamic: "ほかのアプリケーション"
    case .process: "このアプリケーション"
    case .unknown: "不明"
    }
  }

  var priority: Int {
    switch self {
    case .system: Int(kCTFontPrioritySystem)
    case .network: Int(kCTFontPriorityNetwork)
    case .computer: Int(kCTFontPriorityComputer)
    case .user: Int(kCTFontPriorityUser)
    case .dynamic: Int(kCTFontPriorityDynamic)
    case .process: Int(kCTFontPriorityProcess)
    case .unknown: 0
    }
  }

  var canExport: Bool {
    self != .system
  }
}
