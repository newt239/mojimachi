import Foundation
import Sparkle

@MainActor
@Observable
final class UpdaterModel {
  private let controller: SPUStandardUpdaterController

  var isAvailable: Bool {
    let key = Bundle.main.object(forInfoDictionaryKey: "SUPublicEDKey") as? String
    return !(key ?? "").isEmpty
  }

  init() {
    controller = SPUStandardUpdaterController(
      startingUpdater: false,
      updaterDelegate: nil,
      userDriverDelegate: nil
    )
    guard isAvailable else { return }
    controller.startUpdater()
  }

  func checkForUpdates() {
    controller.updater.checkForUpdates()
  }
}
