import SwiftUI

struct FontSelectionMenu: View {
  let model: FontBrowserModel
  let ids: Set<FontFamily.ID>

  var body: some View {
    let families = model.families(for: ids)

    if !families.isEmpty {
      Button(model.areAllFavorites(families) ? "お気に入りから外す" : "お気に入りに追加") {
        model.toggleFavorites(families)
      }

      Divider()

      Button("書き出す…") {
        model.prepareExport(families)
      }

      Divider()

      Button("PostScript 名をコピー") {
        model.copyPostScriptNames(families)
      }

      Button("Finder で表示") {
        model.revealInFinder(families)
      }
      .disabled(families.allSatisfy { model.style(for: $0)?.fileURL == nil })
    }
  }
}
