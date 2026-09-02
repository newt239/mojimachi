import SwiftUI

@main
struct MojimachiApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
    }
    .defaultSize(width: 1200, height: 800)
    .commands {
      AppCommands()
    }
  }
}
