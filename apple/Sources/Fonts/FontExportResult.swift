import Foundation

struct FontExportResult: Sendable {
  let copied: [URL]
  let failed: [String]

  var summary: String {
    guard !copied.isEmpty || !failed.isEmpty else {
      return "書き出せるフォントがありませんでした。"
    }
    var text = "\(copied.count) 件のフォントファイルを書き出しました。"
    if !failed.isEmpty {
      text += "\n\(failed.count) 件は書き出せませんでした: \(failed.joined(separator: ", "))"
    }
    return text
  }
}
