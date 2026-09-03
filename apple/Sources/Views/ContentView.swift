import AppKit
import SwiftUI

struct ContentView: View {
  @State private var model = FontBrowserModel()

  var body: some View {
    NavigationSplitView {
      SidebarView(model: model)
        .navigationSplitViewColumnWidth(min: 200, ideal: 240, max: 320)
    } detail: {
      FontListView(model: model)
    }
    .frame(minWidth: 900, minHeight: 520)
    .background(
      WindowFrameRestorer(key: "windowFrame", defaultSize: NSSize(width: 1200, height: 800))
    )
    .task { model.load() }
  }
}
