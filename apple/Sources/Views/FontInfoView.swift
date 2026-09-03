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
            LabeledContent(record.label) {
              Text(record.value)
                .textSelection(.enabled)
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
          }
        }

        if let url = model.selectedStyle.fileURL {
          Section("ファイル") {
            LabeledContent("場所") {
              Text(url.path(percentEncoded: false))
                .textSelection(.enabled)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            Button("Finder で表示") { model.revealInFinder() }
          }
        }
      }
      .formStyle(.grouped)
    }
  }
}
