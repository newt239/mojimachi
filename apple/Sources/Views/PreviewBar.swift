import SwiftUI

struct PreviewBar: View {
  @Bindable var model: FontBrowserModel

  var body: some View {
    HStack(spacing: 12) {
      TextField("プレビューする文字", text: $model.previewText)
        .textFieldStyle(.roundedBorder)

      Menu {
        ForEach(FontBrowserModel.presetTexts, id: \.self) { text in
          Button(text) { model.previewText = text }
        }
      } label: {
        Image(systemName: "text.badge.plus")
      }
      .menuIndicator(.hidden)
      .fixedSize()
      .help("サンプル文字列を選ぶ")

      Divider()
        .frame(height: 16)

      Image(systemName: "textformat.size.smaller")
        .foregroundStyle(.secondary)
      Slider(value: $model.fontSize, in: 12...120)
        .frame(width: 160)
      Image(systemName: "textformat.size.larger")
        .foregroundStyle(.secondary)
      Text("\(Int(model.fontSize))px")
        .monospacedDigit()
        .foregroundStyle(.secondary)
        .frame(width: 44, alignment: .trailing)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 8)
    .background(.bar)
  }
}
