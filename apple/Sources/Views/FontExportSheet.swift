import SwiftUI

struct FontExportSheet: View {
  let model: FontBrowserModel
  let plan: FontExportPlan

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Text("フォントを書き出す")
        .font(.headline)

      VStack(alignment: .leading, spacing: 8) {
        if plan.isEmpty {
          Label("書き出せるフォントがありません。", systemImage: "exclamationmark.triangle")
        } else {
          Text("\(plan.urls.count) 個のフォントファイルを選んだフォルダにコピーします。")
        }

        if plan.excludedSystemCount > 0 {
          Text("システムフォント \(plan.excludedSystemCount) 個はライセンス上書き出せないため除外します。")
            .font(.callout)
            .foregroundStyle(.secondary)
        }

        if plan.missingFileCount > 0 {
          Text("ファイルを特定できないフォント \(plan.missingFileCount) 個を除外します。")
            .font(.callout)
            .foregroundStyle(.secondary)
        }

        if plan.hasCollections {
          Text(
            "\(plan.collectionURLs.count) 個は .ttc（複数のフォントをまとめたファイル）です。選んでいない書体も一緒に書き出されます。"
          )
          .font(.callout)
          .foregroundStyle(.orange)
        }
      }

      HStack {
        Spacer()
        Button("キャンセル") { model.cancelExport() }
          .keyboardShortcut(.cancelAction)
        Button("書き出す…") { model.confirmExport() }
          .keyboardShortcut(.defaultAction)
          .disabled(plan.isEmpty)
      }
    }
    .padding(20)
    .frame(width: 420)
  }
}
