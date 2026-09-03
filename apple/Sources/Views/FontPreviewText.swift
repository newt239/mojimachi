import SwiftUI

struct FontPreviewText: View {
  let text: String
  let fontName: String
  let fontSize: Double
  let orientation: PreviewOrientation

  var body: some View {
    switch orientation {
    case .horizontal:
      Text(text)
        .font(.custom(fontName, fixedSize: fontSize))
        .lineLimit(1)
        .truncationMode(.tail)
    case .vertical:
      VerticalTextView(text: text, fontName: fontName, fontSize: fontSize)
        .frame(width: fontSize * 1.6)
    }
  }
}
