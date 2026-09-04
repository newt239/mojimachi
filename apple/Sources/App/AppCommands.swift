import SwiftUI

struct AppCommands: Commands {
  private static let repositoryURL = URL(string: "https://github.com/newt239/mojimachi")

  let updater: UpdaterModel

  var body: some Commands {
    CommandGroup(replacing: .newItem) {}

    CommandGroup(after: .appInfo) {
      if updater.isAvailable {
        Button("アップデートを確認…") { updater.checkForUpdates() }
      }
    }

    CommandGroup(replacing: .help) {
      if let repositoryURL = Self.repositoryURL {
        Link("もじまち のヘルプ", destination: repositoryURL)
      }
    }
  }
}
