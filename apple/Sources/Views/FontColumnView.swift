import SwiftUI

struct FontColumnView: View {
  let model: FontBrowserModel
  let family: FontFamily

  private var columnWidth: Double {
    max(model.fontSize * 1.8, 96)
  }

  var body: some View {
    VStack(spacing: 8) {
      if let style = model.style(for: family) {
        FontPreviewText(
          text: model.previewText,
          fontName: style.postScriptName,
          fontSize: model.fontSize,
          orientation: .vertical
        )
        .frame(maxHeight: .infinity, alignment: .top)
      }

      Text(family.name)
        .font(.caption)
        .lineLimit(2)
        .multilineTextAlignment(.center)
        .foregroundStyle(model.isFavorite(family) ? .primary : .secondary)
    }
    .frame(width: columnWidth)
    .contentShape(.rect)
    .onTapGesture { model.toggleFavorite(family) }
    .help(model.isFavorite(family) ? "クリックでお気に入りから外す" : "クリックでお気に入りに追加")
  }
}
