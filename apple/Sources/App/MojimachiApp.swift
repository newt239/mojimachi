import SwiftUI

@main
struct MojimachiApp: App {
  @State private var updater = UpdaterModel()

  var body: some Scene {
    WindowGroup {
      ContentView()
    }
    .commands {
      AppCommands(updater: updater)
    }
  }
}
