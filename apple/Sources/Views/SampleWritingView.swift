import SwiftUI

struct SampleWritingView: View {
  @Bindable var model: FontDetailModel

  var body: some View {
    VStack(spacing: 0) {
      controls
      Divider()
      canvas
    }
  }

  private var controls: some View {
    HStack(spacing: 20) {
      HStack(spacing: 8) {
        Text("サイズ")
        Slider(value: $model.sampleSize, in: 8...160)
          .frame(width: 140)
        Text(model.sampleSize.formatted(.number.precision(.fractionLength(0))))
          .font(.callout.monospacedDigit())
          .frame(width: 32, alignment: .trailing)
      }

      HStack(spacing: 8) {
        Text("行間")
        Slider(value: $model.lineSpacing, in: 0...60)
          .frame(width: 120)
        Text(model.lineSpacing.formatted(.number.precision(.fractionLength(0))))
          .font(.callout.monospacedDigit())
          .frame(width: 32, alignment: .trailing)
      }

      ColorPicker("文字色", selection: foregroundBinding, supportsOpacity: false)
      ColorPicker("背景色", selection: backgroundBinding, supportsOpacity: false)

      Spacer(minLength: 0)
    }
    .padding(12)
  }

  private var canvas: some View {
    TextEditor(text: $model.sampleText)
      .font(model.font(size: model.sampleSize))
      .lineSpacing(model.lineSpacing)
      .foregroundStyle(Color(nsColor: model.foreground))
      .scrollContentBackground(.hidden)
      .background(Color(nsColor: model.background))
      .padding(16)
      .background(Color(nsColor: model.background))
      .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private var foregroundBinding: Binding<Color> {
    Binding(
      get: { Color(nsColor: model.foreground) },
      set: { model.foreground = NSColor($0) }
    )
  }

  private var backgroundBinding: Binding<Color> {
    Binding(
      get: { Color(nsColor: model.background) },
      set: { model.background = NSColor($0) }
    )
  }
}
