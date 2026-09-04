import CoreText
import Foundation

final class FontChangeMonitor {
  static let notificationName = Notification.Name(
    kCTFontManagerRegisteredFontsChangedNotification as String
  )

  let changes: AsyncStream<Void>

  private let center: NotificationCenter
  private let observer: any NSObjectProtocol

  init(center: NotificationCenter = .default) {
    let (stream, continuation) = AsyncStream<Void>.makeStream()
    self.center = center
    self.changes = stream
    observer = center.addObserver(
      forName: Self.notificationName,
      object: nil,
      queue: .main
    ) { _ in
      continuation.yield()
    }
  }

  deinit {
    center.removeObserver(observer)
  }
}
