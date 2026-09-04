import SwiftUI

struct FontInfoView: View {
  let model: FontDetailModel

  var body: some View {
    if model.nameRecords.isEmpty {
      ContentUnavailableView(
        "情報を読み取れませんでした",
        systemImage: "doc.questionmark",
        description: Text("このフォントは name テーブルを公開していません。")
      )
    } else {
      Form {
        Section {
          ForEach(model.nameRecords) { record in
            row(record.label) {
              Text(record.value)
                .textSelection(.enabled)
            }
          }
        }

        if let url = model.selectedStyle.fileURL {
          Section("ファイル") {
            row("場所") {
              Text(url.path(percentEncoded: false))
                .textSelection(.enabled)
            }
            Button("Finder で表示") { model.revealInFinder() }
          }
        }
      }
      .formStyle(.grouped)
    }
  }

  private func row(_ label: String, @ViewBuilder value: () -> some View) -> some View {
    HStack(alignment: .firstTextBaseline, spacing: 16) {
      Text(label)
        .foregroundStyle(.secondary)
        .frame(width: 140, alignment: .leading)
      value()
        .frame(maxWidth: .infinity, alignment: .leading)
    }
  }
}
