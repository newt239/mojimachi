import SwiftUI

struct PreviewControls: ToolbarContent {
  @Bindable var model: FontBrowserModel

  var body: some ToolbarContent {
    ToolbarItem {
      Picker("ウエイト", selection: $model.weight) {
        ForEach(PreviewWeight.allCases) { weight in
          Text(weight.label).tag(weight)
        }
      }
      .pickerStyle(.menu)
      .frame(width: 96)
      .help("各ファミリーに実在するスタイルのうち、最も近いウエイトで表示する")
    }

    ToolbarItem {
      Toggle(isOn: $model.isItalic) {
        Image(systemName: "italic")
      }
      .help("斜体のあるファミリーは斜体で表示する")
    }

    ToolbarItem {
      Picker("表示方向", selection: $model.orientation) {
        ForEach(PreviewOrientation.allCases) { orientation in
          Image(systemName: orientation.symbolName)
            .accessibilityLabel(orientation.label)
            .help(orientation.label)
            .tag(orientation)
        }
      }
      .pickerStyle(.segmented)
    }
  }
}
