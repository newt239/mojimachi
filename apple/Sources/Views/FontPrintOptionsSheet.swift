import SwiftUI

struct FontPrintOptionsSheet: View {
  @Bindable var model: FontPrintModel

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Text("フォントカタログをプリント")
        .font(.headline)

      Picker("レイアウト", selection: $model.style) {
        ForEach(FontPrintStyle.allCases) { style in
          Text(style.title).tag(style)
        }
      }
      .pickerStyle(.segmented)
      .labelsHidden()

      Text(model.style.summary)
        .font(.callout)
        .foregroundStyle(.secondary)

      if model.style.needsSingleTarget {
        Picker("フォント", selection: $model.selectedTargetID) {
          ForEach(model.targets) { target in
            Text(target.label).tag(Optional(target.id))
          }
        }
      } else {
        Text("\(model.targets.count) 書体をプリントします。")
      }

      TextField("サンプル文字列", text: $model.sampleText)
        .textFieldStyle(.roundedBorder)

      HStack(spacing: 12) {
        Text("サイズ")
        Slider(value: $model.sampleSize, in: 8...72)
        Text("\(Int(model.sampleSize))px")
          .monospacedDigit()
          .frame(width: 52, alignment: .trailing)
      }

      pageEstimate

      HStack {
        Spacer()
        Button("キャンセル") { model.isPresented = false }
          .keyboardShortcut(.cancelAction)
        Button("プリント…") { model.run() }
          .keyboardShortcut(.defaultAction)
          .disabled(model.pages.isEmpty || model.isBuilding)
      }
    }
    .padding(20)
    .frame(width: 460)
  }

  @ViewBuilder
  private var pageEstimate: some View {
    if model.isBuilding {
      HStack(spacing: 8) {
        ProgressView().controlSize(.small)
        Text("ページ数を数えています")
          .foregroundStyle(.secondary)
      }
    } else if model.pages.isEmpty {
      Text("プリントできるページがありません。")
        .foregroundStyle(.secondary)
    } else {
      Text("約 \(model.pageCount) ページ")
        .foregroundStyle(model.pageCount > 50 ? .orange : .secondary)
    }
  }
}
