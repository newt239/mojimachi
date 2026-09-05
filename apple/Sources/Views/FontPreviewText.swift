import SwiftUI

struct FontPreviewText: View {
  let text: String
  let fontName: String
  let fontSize: Double
  let orientation: PreviewOrientation

  private var font: Font {
    guard let ctFont = PreviewFont.make(postScriptName: fontName, size: fontSize) else {
      return .system(size: fontSize)
    }
    return Font(ctFont)
  }

  var body: some View {
    switch orientation {
    case .horizontal:
      Text(text)
        .font(font)
        .lineLimit(1)
        .truncationMode(.tail)
    case .vertical:
      VerticalTextView(text: text, fontName: fontName, fontSize: fontSize)
        .frame(width: fontSize * 1.6)
    }
  }
}
