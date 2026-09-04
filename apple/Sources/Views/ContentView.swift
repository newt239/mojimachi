import SwiftUI

struct ContentView: View {
  let model: FontBrowserModel
  @Bindable var printModel: FontPrintModel

  @State private var path = NavigationPath()

  var body: some View {
    NavigationSplitView {
      SidebarView(model: model)
        .navigationSplitViewColumnWidth(min: 200, ideal: 240, max: 320)
    } detail: {
      NavigationStack(path: $path) {
        FontListView(model: model, printModel: printModel, path: $path)
          .navigationDestination(for: FontFamily.self) { family in
            FontDetailView(browser: model, family: family)
          }
      }
    }
    .frame(minWidth: 900, minHeight: 520)
    .background(
      WindowFrameRestorer(key: "windowFrame", defaultSize: NSSize(width: 1200, height: 800))
    )
    .sheet(
      isPresented: Binding(
        get: { model.exportPlan != nil },
        set: { if !$0 { model.cancelExport() } }
      )
    ) {
      if let plan = model.exportPlan {
        FontExportSheet(model: model, plan: plan)
      }
    }
    .alert(
      "フォントの書き出し",
      isPresented: Binding(
        get: { model.exportMessage != nil },
        set: { if !$0 { model.exportMessage = nil } }
      )
    ) {
      Button("OK") { model.exportMessage = nil }
    } message: {
      Text(model.exportMessage ?? "")
    }
    .sheet(isPresented: $printModel.isPresented) {
      FontPrintOptionsSheet(model: printModel)
    }
    .task { model.load() }
  }
}
