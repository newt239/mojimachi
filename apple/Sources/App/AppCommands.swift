import SwiftUI

struct AppCommands: Commands {
  private static let repositoryURL = URL(string: "https://github.com/newt239/mojimachi")

  let updater: UpdaterModel
  let browser: FontBrowserModel
  let printModel: FontPrintModel

  var body: some Commands {
    CommandGroup(replacing: .newItem) {}

    CommandGroup(replacing: .printItem) {
      Button("プリント…") {
        let families =
          browser.selectedFamilies.isEmpty ? browser.visibleFamilies : browser.selectedFamilies
        printModel.prepare(families, weight: browser.weight, isItalic: browser.isItalic)
        printModel.isPresented = true
      }
      .keyboardShortcut("p")
      .disabled(browser.loadState != .loaded || browser.visibleFamilies.isEmpty)
    }

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
