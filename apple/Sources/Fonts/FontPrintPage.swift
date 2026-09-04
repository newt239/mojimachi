enum FontPrintPage: Hashable, Sendable {
  case catalog(targets: [FontPrintTarget])
  case repertoire(target: FontPrintTarget, glyphs: [FontGlyph], columns: Int)
  case waterfall(target: FontPrintTarget, sizes: [Double])
}
