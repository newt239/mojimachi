enum FontPrintStyle: String, CaseIterable, Identifiable {
  case catalog
  case repertoire
  case waterfall

  var id: String { rawValue }

  var title: String {
    switch self {
    case .catalog: "カタログ"
    case .repertoire: "レパートリー"
    case .waterfall: "ウォーターフォール"
    }
  }

  var summary: String {
    switch self {
    case .catalog: "ファミリーごとに名前とサンプルを 1 行ずつ並べます。"
    case .repertoire: "1 つのフォントの全グリフを格子状に並べます。"
    case .waterfall: "1 つのフォントをサイズ段階で並べます。"
    }
  }

  var needsSingleTarget: Bool { self != .catalog }
}
