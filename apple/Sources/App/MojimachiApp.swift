import SwiftUI

@main
struct MojimachiApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
    }
    .commands {
      AppCommands()
    }
  }
}
