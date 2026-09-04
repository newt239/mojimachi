import SwiftUI

@main
struct MojimachiApp: App {
  @State private var updater = UpdaterModel()
  @State private var model = FontBrowserModel()

  var body: some Scene {
    WindowGroup {
      ContentView(model: model)
    }
    .commands {
      AppCommands(updater: updater)
    }
  }
}
