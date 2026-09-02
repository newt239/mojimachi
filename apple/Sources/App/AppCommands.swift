import SwiftUI

struct AppCommands: Commands {
  private static let repositoryURL = URL(string: "https://github.com/newt239/mojimachi")

  var body: some Commands {
    CommandGroup(replacing: .newItem) {}

    CommandGroup(replacing: .help) {
      if let repositoryURL = Self.repositoryURL {
        Link("もじまち のヘルプ", destination: repositoryURL)
      }
    }
  }
}
