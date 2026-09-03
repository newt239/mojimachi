import SwiftUI

struct SidebarView: View {
  @Bindable var model: FontBrowserModel

  var body: some View {
    List {
      Section {
        scopeRow(.all, title: "すべてのフォント", symbol: "textformat", count: model.families.count)
        scopeRow(
          .favorites, title: "お気に入り", symbol: "star", count: model.favoriteFamilies.count)
      }

      Section("フィルタ") {
        Toggle("日本語のみ", isOn: $model.japaneseOnly)
      }

      if !model.favoriteFamilies.isEmpty {
        Section("お気に入り") {
          ForEach(model.favoriteFamilies) { family in
            Button {
              model.scope = .all
              model.scrollTarget = family.id
            } label: {
              Text(family.name)
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
                .contentShape(.rect)
            }
            .buttonStyle(.plain)
          }
        }
      }
    }
    .listStyle(.sidebar)
  }

  private func scopeRow(
    _ scope: FontBrowserModel.Scope, title: String, symbol: String, count: Int
  ) -> some View {
    Button {
      model.scope = scope
    } label: {
      HStack {
        Label(title, systemImage: symbol)
        Spacer()
        Text(count.formatted())
          .foregroundStyle(.secondary)
          .monospacedDigit()
      }
      .contentShape(.rect)
    }
    .buttonStyle(.plain)
    .fontWeight(model.scope == scope ? .semibold : .regular)
  }
}
