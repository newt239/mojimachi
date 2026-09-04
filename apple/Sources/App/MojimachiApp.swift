import SwiftUI

@main
struct MojimachiApp: App {
  @State private var updater = UpdaterModel()
  @State private var model = FontBrowserModel()
  @State private var printModel = FontPrintModel()

  var body: some Scene {
    WindowGroup {
      ContentView(model: model, printModel: printModel)
    }
    .commands {
      AppCommands(updater: updater, browser: model, printModel: printModel)
    }
  }
}
