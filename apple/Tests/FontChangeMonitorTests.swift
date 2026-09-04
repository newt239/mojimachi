import Foundation
import Testing

@testable import Mojimachi

@Suite("フォント変更の監視")
struct FontChangeMonitorTests {
  @Test("通知が届くとストリームに値が流れる")
  func yieldsOnNotification() async throws {
    let center = NotificationCenter()
    let monitor = FontChangeMonitor(center: center)

    var iterator = monitor.changes.makeAsyncIterator()
    center.post(name: FontChangeMonitor.notificationName, object: nil)
    let received: Void? = await iterator.next()

    #expect(received != nil)
  }

  @Test("通知を複数回受け取れる")
  func yieldsRepeatedly() async throws {
    let center = NotificationCenter()
    let monitor = FontChangeMonitor(center: center)

    var iterator = monitor.changes.makeAsyncIterator()
    center.post(name: FontChangeMonitor.notificationName, object: nil)
    center.post(name: FontChangeMonitor.notificationName, object: nil)

    #expect(await iterator.next() != nil)
    #expect(await iterator.next() != nil)
  }
}
