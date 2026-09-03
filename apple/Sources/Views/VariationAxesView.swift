import SwiftUI

struct VariationAxesView: View {
  @Bindable var model: FontDetailModel

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      HStack {
        Text("可変フォントの軸")
          .font(.headline)
        Spacer()
        Button("既定値に戻す") { model.resetAxes() }
          .buttonStyle(.link)
      }

      ForEach(model.axes) { axis in
        HStack(spacing: 12) {
          Text(axis.name)
            .frame(width: 120, alignment: .leading)

          Slider(
            value: binding(for: axis),
            in: axis.minimumValue...axis.maximumValue
          )

          Text(value(for: axis).formatted(.number.precision(.fractionLength(0...1))))
            .font(.callout.monospacedDigit())
            .frame(width: 56, alignment: .trailing)

          Text(FontDetails.tag(for: axis.identifier))
            .font(.caption.monospaced())
            .foregroundStyle(.secondary)
        }
      }
    }
    .padding(12)
    .background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 8))
  }

  private func value(for axis: FontVariationAxis) -> Double {
    model.axisValues[axis.identifier] ?? axis.defaultValue
  }

  private func binding(for axis: FontVariationAxis) -> Binding<Double> {
    Binding(
      get: { value(for: axis) },
      set: { model.axisValues[axis.identifier] = $0 }
    )
  }
}
