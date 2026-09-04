import SwiftUI

struct FontDuplicateListView: View {
  @Bindable var model: FontBrowserModel

  var body: some View {
    VStack(spacing: 0) {
      controls
      Divider()
      content
    }
  }

  private var controls: some View {
    HStack(spacing: 16) {
      Toggle("システム標準どうしの重複も表示", isOn: $model.showsSystemDuplicates)
      Spacer(minLength: 0)
      Text("\(model.visibleDuplicates.count) 件")
        .foregroundStyle(.secondary)
        .monospacedDigit()
    }
    .padding(12)
  }

  @ViewBuilder
  private var content: some View {
    if model.visibleDuplicates.isEmpty {
      ContentUnavailableView {
        Label("重複しているフォントはありません", systemImage: "checkmark.seal")
      } description: {
        Text(
          model.showsSystemDuplicates
            ? "同じ PostScript 名を持つフォントは見つかりませんでした。"
            : "システム標準どうしの重複を表示すると見つかることがあります。"
        )
      }
    } else {
      List(model.visibleDuplicates) { duplicate in
        FontDuplicateRowView(model: model, duplicate: duplicate)
      }
    }
  }
}
