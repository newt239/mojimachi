import SwiftUI

struct FontRowView: View {
  let model: FontBrowserModel
  let family: FontFamily

  var body: some View {
    let style = model.style(for: family)

    VStack(alignment: .leading, spacing: 6) {
      HStack(spacing: 8) {
        Button {
          model.toggleFavorite(family)
        } label: {
          Image(systemName: model.isFavorite(family) ? "star.fill" : "star")
            .foregroundStyle(model.isFavorite(family) ? .yellow : .secondary)
        }
        .buttonStyle(.plain)
        .help(model.isFavorite(family) ? "お気に入りから外す" : "お気に入りに追加")

        Text(family.name)
          .font(.headline)

        if let style {
          Text(style.styleName)
            .font(.caption)
            .foregroundStyle(.secondary)
        }

        if model.isItalic, !family.hasItalic {
          Text("斜体なし")
            .font(.caption)
            .foregroundStyle(.tertiary)
        }

        Spacer(minLength: 0)

        NavigationLink(value: family) {
          Image(systemName: "chevron.right")
            .foregroundStyle(.secondary)
        }
        .buttonStyle(.plain)
        .help("詳細を見る")
      }

      if let style {
        FontPreviewText(
          text: model.previewText,
          fontName: style.postScriptName,
          fontSize: model.fontSize,
          orientation: model.orientation
        )
      }
    }
    .padding(.vertical, 4)
  }
}
