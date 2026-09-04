import SwiftUI

struct FontSelectionMenu: View {
  let model: FontBrowserModel
  let printModel: FontPrintModel
  @Binding var path: NavigationPath
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

      Button("プリント…") {
        printModel.prepare(families, weight: model.weight, isItalic: model.isItalic)
        printModel.isPresented = true
      }

      Button("並べて比較") {
        path.append(model.comparison(for: families))
      }
      .disabled(!model.canCompare(families))
      .help("2 書体以上を選ぶと比較できます")

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
