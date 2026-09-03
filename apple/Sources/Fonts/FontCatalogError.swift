import Foundation

enum FontCatalogError: Error, LocalizedError {
  case enumerationFailed

  var errorDescription: String? {
    switch self {
    case .enumerationFailed:
      "インストールされているフォントを読み取れませんでした。"
    }
  }
}
