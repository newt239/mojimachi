import SwiftUI

struct FontListView: View {
  @Bindable var model: FontBrowserModel

  var body: some View {
    content
      .safeAreaInset(edge: .bottom, spacing: 0) { PreviewBar(model: model) }
      .searchable(text: $model.searchText, prompt: "フォントを検索")
      .toolbar { PreviewControls(model: model) }
      .navigationTitle(model.scope == .favorites ? "お気に入り" : "すべてのフォント")
      .navigationSubtitle("\(model.visibleFamilies.count) ファミリー")
  }

  @ViewBuilder
  private var content: some View {
    switch model.loadState {
    case .loading:
      ProgressView("フォントを読み込んでいます")
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    case .failed(let message):
      ContentUnavailableView {
        Label("フォントを読み込めませんでした", systemImage: "exclamationmark.triangle")
      } description: {
        Text(message)
      }
    case .loaded:
      if model.visibleFamilies.isEmpty {
        ContentUnavailableView {
          Label("該当するフォントがありません", systemImage: "magnifyingglass")
        } description: {
          Text(emptyDescription)
        }
      } else if model.orientation == .vertical {
        verticalList
      } else {
        horizontalList
      }
    }
  }

  private var emptyDescription: String {
    model.scope == .favorites
      ? "行の左にある星を押すとお気に入りに追加できます。"
      : "検索条件を変えてみてください。"
  }

  private var horizontalList: some View {
    ScrollViewReader { proxy in
      List(model.visibleFamilies) { family in
        FontRowView(model: model, family: family)
          .id(family.id)
      }
      .onChange(of: model.scrollTarget) { _, target in
        guard let target else { return }
        withAnimation { proxy.scrollTo(target, anchor: .top) }
        model.scrollTarget = nil
      }
    }
  }

  private var verticalList: some View {
    ScrollView(.horizontal) {
      LazyHStack(alignment: .top, spacing: 4) {
        ForEach(model.visibleFamilies) { family in
          FontColumnView(model: model, family: family)
            .id(family.id)
        }
      }
      .padding()
    }
  }
}
