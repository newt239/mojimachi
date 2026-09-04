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

        Section("フォント") {
          row("種類") { Text(model.selectedStyle.format.label) }
          row("場所") { Text(model.selectedStyle.location.label) }
          if model.totalGlyphCount > 0 {
            row("字形数") { Text(model.totalGlyphCount.formatted()) }
          }
          if !model.languageSummary.isEmpty {
            row("対応言語") { Text(model.languageSummary) }
          }
        }

        if model.isLoadingCoverage || model.hasJapaneseCoverage {
          Section("日本語の文字集合") {
            if model.isLoadingCoverage {
              ProgressView()
                .controlSize(.small)
            } else {
              ForEach(model.coverages) { coverage in
                row(coverage.characterSet.name) {
                  coverageBar(coverage)
                }
              }
            }
          }
        }

        if let url = model.selectedStyle.fileURL {
          Section("ファイル") {
            row("パス") {
              Text(url.path(percentEncoded: false))
                .textSelection(.enabled)
            }
            if let fileSizeText = model.fileSizeText {
              row("サイズ") { Text(fileSizeText) }
            }
            Button("Finder で表示") { model.revealInFinder() }
          }
        }
      }
      .formStyle(.grouped)
    }
  }

  private func coverageBar(_ coverage: FontCharacterSetCoverage) -> some View {
    HStack(spacing: 12) {
      ProgressView(value: coverage.ratio)
        .frame(maxWidth: 180)

      Text(coverage.ratio.formatted(.percent.precision(.fractionLength(0))))
        .monospacedDigit()
        .frame(width: 44, alignment: .trailing)

      Text("\(coverage.coveredCount.formatted()) / \(coverage.characterSet.count.formatted()) 字")
        .font(.caption)
        .foregroundStyle(.secondary)
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
