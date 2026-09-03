import Foundation

struct UnicodeBlock: Hashable, Sendable, Identifiable {
  let name: String
  let range: ClosedRange<UInt32>

  var id: UInt32 { range.lowerBound }

  static let all: [UnicodeBlock] = [
    UnicodeBlock(name: "基本ラテン", range: 0x0020...0x007E),
    UnicodeBlock(name: "ラテン 1 補助", range: 0x00A0...0x00FF),
    UnicodeBlock(name: "ラテン拡張 A", range: 0x0100...0x017F),
    UnicodeBlock(name: "ラテン拡張 B", range: 0x0180...0x024F),
    UnicodeBlock(name: "IPA 拡張", range: 0x0250...0x02AF),
    UnicodeBlock(name: "前進を伴う修飾文字", range: 0x02B0...0x02FF),
    UnicodeBlock(name: "ダイアクリティカルマーク", range: 0x0300...0x036F),
    UnicodeBlock(name: "ギリシャ・コプト", range: 0x0370...0x03FF),
    UnicodeBlock(name: "キリル", range: 0x0400...0x04FF),
    UnicodeBlock(name: "ヘブライ", range: 0x0590...0x05FF),
    UnicodeBlock(name: "アラビア", range: 0x0600...0x06FF),
    UnicodeBlock(name: "デーヴァナーガリー", range: 0x0900...0x097F),
    UnicodeBlock(name: "タイ", range: 0x0E00...0x0E7F),
    UnicodeBlock(name: "記号と句読点", range: 0x2000...0x206F),
    UnicodeBlock(name: "上付き・下付き", range: 0x2070...0x209F),
    UnicodeBlock(name: "通貨記号", range: 0x20A0...0x20CF),
    UnicodeBlock(name: "文字様記号", range: 0x2100...0x214F),
    UnicodeBlock(name: "数字に準じるもの", range: 0x2150...0x218F),
    UnicodeBlock(name: "矢印", range: 0x2190...0x21FF),
    UnicodeBlock(name: "数学記号", range: 0x2200...0x22FF),
    UnicodeBlock(name: "囲み英数字", range: 0x2460...0x24FF),
    UnicodeBlock(name: "罫線素片", range: 0x2500...0x257F),
    UnicodeBlock(name: "ブロック要素", range: 0x2580...0x259F),
    UnicodeBlock(name: "幾何学模様", range: 0x25A0...0x25FF),
    UnicodeBlock(name: "その他の記号", range: 0x2600...0x26FF),
    UnicodeBlock(name: "装飾記号", range: 0x2700...0x27BF),
    UnicodeBlock(name: "CJK 記号と句読点", range: 0x3000...0x303F),
    UnicodeBlock(name: "ひらがな", range: 0x3040...0x309F),
    UnicodeBlock(name: "カタカナ", range: 0x30A0...0x30FF),
    UnicodeBlock(name: "注音字母", range: 0x3100...0x312F),
    UnicodeBlock(name: "ハングル互換字母", range: 0x3130...0x318F),
    UnicodeBlock(name: "囲み CJK 文字・月", range: 0x3200...0x32FF),
    UnicodeBlock(name: "CJK 互換文字", range: 0x3300...0x33FF),
    UnicodeBlock(name: "CJK 統合漢字拡張 A", range: 0x3400...0x4DBF),
    UnicodeBlock(name: "CJK 統合漢字", range: 0x4E00...0x9FFF),
    UnicodeBlock(name: "ハングル音節", range: 0xAC00...0xD7A3),
    UnicodeBlock(name: "CJK 互換漢字", range: 0xF900...0xFAFF),
    UnicodeBlock(name: "半角・全角形", range: 0xFF00...0xFFEF),
    UnicodeBlock(name: "その他の記号と絵文字", range: 0x1F300...0x1F5FF),
    UnicodeBlock(name: "顔文字", range: 0x1F600...0x1F64F),
    UnicodeBlock(name: "交通と地図の記号", range: 0x1F680...0x1F6FF),
    UnicodeBlock(name: "補助記号と絵文字", range: 0x1F900...0x1F9FF),
    UnicodeBlock(name: "CJK 統合漢字拡張 B", range: 0x20000...0x2A6DF),
  ]
}
