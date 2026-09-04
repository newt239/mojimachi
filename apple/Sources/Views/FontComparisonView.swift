import SwiftUI

struct FontComparisonView: View {
  @Bindable var model: FontBrowserModel
  let comparison: FontComparison

  private static let tints: [Color] = [.red, .blue, .green, .orange]

  private var families: [FontFamily] {
    model.families(named: comparison.familyNames)
  }

  var body: some View {
    VStack(spacing: 0) {
      header
      Divider()
      content
    }
    .safeAreaInset(edge: .bottom, spacing: 0) { PreviewBar(model: model) }
    .toolbar { PreviewControls(model: model) }
    .navigationTitle("比較")
    .navigationSubtitle("\(families.count) 書体")
  }

  private var header: some View {
    HStack(spacing: 16) {
      Picker("表示", selection: $model.comparisonMode) {
        ForEach(FontComparisonMode.allCases) { mode in
          Label(mode.label, systemImage: mode.symbolName).tag(mode)
        }
      }
      .pickerStyle(.segmented)
      .labelsHidden()
      .frame(maxWidth: 220)
      .disabled(model.orientation == .vertical)

      if model.orientation == .vertical {
        Text("縦書きでは並べて表示のみ使えます。")
          .font(.caption)
          .foregroundStyle(.secondary)
      }

      Spacer(minLength: 0)
    }
    .padding(12)
  }

  @ViewBuilder
  private var content: some View {
    if families.count < 2 {
      ContentUnavailableView {
        Label("比較するフォントがありません", systemImage: "square.stack.3d.down.right")
      } description: {
        Text("一覧で 2 書体以上を選んでから比較してください。")
      }
    } else if model.comparisonMode == .onion, model.orientation == .horizontal {
      onionView
    } else {
      stackedView
    }
  }

  private var stackedView: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 24) {
        ForEach(families) { family in
          VStack(alignment: .leading, spacing: 6) {
            Text(family.name)
              .font(.caption)
              .foregroundStyle(.secondary)

            if let style = model.style(for: family) {
              FontPreviewText(
                text: model.previewText,
                fontName: style.postScriptName,
                fontSize: model.fontSize,
                orientation: model.orientation
              )
            }
          }
        }
      }
      .padding()
      .frame(maxWidth: .infinity, alignment: .leading)
    }
  }

  private var onionView: some View {
    VStack(alignment: .leading, spacing: 16) {
      legend

      ScrollView([.horizontal, .vertical]) {
        ZStack(alignment: Alignment(horizontal: .leading, vertical: .firstTextBaseline)) {
          ForEach(Array(families.enumerated()), id: \.element.id) { index, family in
            if let style = model.style(for: family) {
              Text(model.previewText)
                .font(.custom(style.postScriptName, fixedSize: model.fontSize))
                .lineLimit(1)
                .fixedSize()
                .foregroundStyle(Self.tints[index % Self.tints.count])
                .opacity(0.55)
            }
          }
        }
        .padding()
      }
    }
    .padding(.top, 12)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }

  private var legend: some View {
    HStack(spacing: 16) {
      ForEach(Array(families.enumerated()), id: \.element.id) { index, family in
        HStack(spacing: 6) {
          Circle()
            .fill(Self.tints[index % Self.tints.count])
            .frame(width: 10, height: 10)
          Text(family.name)
            .font(.caption)
        }
      }
      Spacer(minLength: 0)
    }
    .padding(.horizontal)
  }
}
