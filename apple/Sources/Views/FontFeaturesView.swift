import SwiftUI

struct FontFeaturesView: View {
  @Bindable var model: FontDetailModel

  @State private var isExpanded = false

  var body: some View {
    DisclosureGroup(isExpanded: $isExpanded) {
      VStack(alignment: .leading, spacing: 8) {
        ForEach(model.features) { feature in
          row(feature)
        }
      }
      .padding(.top, 8)
    } label: {
      HStack {
        Text("OpenType 機能")
          .font(.headline)

        Text("\(model.features.count) 種類")
          .font(.caption)
          .foregroundStyle(.secondary)

        Spacer()

        Button("既定値に戻す") { model.resetFeatures() }
          .buttonStyle(.link)
          .disabled(!model.usesCustomFeatures)
      }
    }
    .padding(12)
    .background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 8))
  }

  private func row(_ feature: FontFeature) -> some View {
    HStack(spacing: 12) {
      Text(feature.name)
        .frame(width: 160, alignment: .leading)
        .help(feature.tooltip ?? feature.name)

      Picker(feature.name, selection: binding(for: feature)) {
        ForEach(feature.selectors) { selector in
          Text(selector.name).tag(selector.identifier)
        }
      }
      .labelsHidden()
      .frame(maxWidth: 280)

      if let sampleText = feature.sampleText {
        Text(sampleText)
          .font(model.font(size: 16))
          .foregroundStyle(.secondary)
          .lineLimit(1)
      }

      Spacer(minLength: 0)
    }
  }

  private func binding(for feature: FontFeature) -> Binding<Int> {
    Binding(
      get: {
        model.featureSelections[feature.identifier] ?? feature.defaultSelector?.identifier ?? 0
      },
      set: { model.featureSelections[feature.identifier] = $0 }
    )
  }
}
