enum FontComparisonMode: String, CaseIterable, Identifiable {
  case stacked
  case onion

  var id: String { rawValue }

  var label: String {
    switch self {
    case .stacked: "並べて"
    case .onion: "重ねて"
    }
  }

  var symbolName: String {
    switch self {
    case .stacked: "rectangle.grid.1x2"
    case .onion: "square.stack.3d.down.right"
    }
  }
}
