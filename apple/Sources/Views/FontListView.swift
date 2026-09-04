import SwiftUI

struct FontListView: View {
  @Bindable var model: FontBrowserModel
  @Binding var path: NavigationPath

  var body: some View {
    content
      .safeAreaInset(edge: .bottom, spacing: 0) {
        if model.scope != .duplicates {
          PreviewBar(model: model)
        }
      }
      .searchable(text: $model.searchText, prompt: "フォントを検索")
      .toolbar { PreviewControls(model: model) }
      .navigationTitle(title)
      .navigationSubtitle(subtitle)
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
      if model.scope == .duplicates {
        FontDuplicateListView(model: model)
      } else if model.visibleFamilies.isEmpty {
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

  private var title: String {
    switch model.scope {
    case .all: "すべてのフォント"
    case .favorites: "お気に入り"
    case .duplicates: "重複"
    }
  }

  private var subtitle: String {
    guard model.scope != .duplicates else {
      return "\(model.visibleDuplicates.count) 件の重複"
    }
    let families = "\(model.visibleFamilies.count) ファミリー"
    guard !model.selection.isEmpty else { return families }
    return "\(families)・\(model.selection.count) 件選択"
  }

  private var emptyDescription: String {
    if !model.coverageScalars.isEmpty {
      return "「\(model.coverageQuery)」をすべて収録するフォントが見つかりませんでした。"
    }
    return model.scope == .favorites
      ? "行の左にある星を押すとお気に入りに追加できます。"
      : "検索条件を変えてみてください。"
  }

  private var horizontalList: some View {
    ScrollViewReader { proxy in
      List(model.visibleFamilies, selection: $model.selection) { family in
        FontRowView(model: model, family: family)
          .id(family.id)
      }
      .contextMenu(forSelectionType: FontFamily.ID.self) { ids in
        FontSelectionMenu(model: model, ids: ids)
      } primaryAction: { ids in
        guard ids.count == 1, let id = ids.first,
          let family = model.visibleFamilies.first(where: { $0.id == id })
        else {
          return
        }
        path.append(family)
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
