import SwiftUI

struct FontDetailView: View {
  let browser: FontBrowserModel
  @State private var model: FontDetailModel

  @MainActor
  init(browser: FontBrowserModel, family: FontFamily) {
    self.browser = browser
    _model = State(
      initialValue: FontDetailModel(family: family, style: browser.style(for: family))
    )
  }

  var body: some View {
    VStack(spacing: 0) {
      header
      Divider()
      if !model.axes.isEmpty, model.tab != .info {
        VariationAxesView(model: model)
          .padding(12)
        Divider()
      }
      content
    }
    .navigationTitle(model.family.name)
    .navigationSubtitle(subtitle)
    .toolbar {
      ToolbarItem {
        Button {
          browser.toggleFavorite(model.family)
        } label: {
          Label(
            browser.isFavorite(model.family) ? "お気に入りから外す" : "お気に入りに追加",
            systemImage: browser.isFavorite(model.family) ? "star.fill" : "star"
          )
        }
      }
      ToolbarItem {
        Button {
          browser.prepareExport([model.family])
        } label: {
          Label("書き出す…", systemImage: "square.and.arrow.up")
        }
      }
      ToolbarItem {
        Button {
          model.revealInFinder()
        } label: {
          Label("Finder で表示", systemImage: "folder")
        }
        .disabled(model.selectedStyle.fileURL == nil)
      }
    }
    .task { model.load() }
  }

  private var subtitle: String {
    let styles = "\(model.family.styles.count) スタイル"
    guard !model.isLoadingGlyphs else { return styles }
    return "\(styles)・\(model.glyphCount) 字"
  }

  private var header: some View {
    HStack(spacing: 16) {
      Picker("スタイル", selection: $model.selectedStyle) {
        ForEach(model.family.styles) { style in
          Text(style.styleName.isEmpty ? style.postScriptName : style.styleName)
            .tag(style)
        }
      }
      .frame(maxWidth: 260)

      Picker("表示", selection: $model.tab) {
        ForEach(FontDetailTab.allCases) { tab in
          Text(tab.title).tag(tab)
        }
      }
      .pickerStyle(.segmented)
      .labelsHidden()
      .frame(maxWidth: 280)

      Spacer(minLength: 0)
    }
    .padding(12)
  }

  @ViewBuilder
  private var content: some View {
    switch model.tab {
    case .info:
      FontInfoView(model: model)
    case .glyphs:
      GlyphGridView(model: model)
    case .sample:
      SampleWritingView(model: model)
    }
  }
}
