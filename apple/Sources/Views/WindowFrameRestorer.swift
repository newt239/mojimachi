import AppKit
import SwiftUI

struct WindowFrameRestorer: NSViewRepresentable {
  let key: String
  let defaultSize: NSSize

  func makeNSView(context: Context) -> NSView {
    FrameRestoringView(key: key, defaultSize: defaultSize)
  }

  func updateNSView(_ nsView: NSView, context: Context) {}
}

private final class FrameRestoringView: NSView {
  private let key: String
  private let defaultSize: NSSize
  private var observedWindow: NSWindow?

  init(key: String, defaultSize: NSSize) {
    self.key = key
    self.defaultSize = defaultSize
    super.init(frame: .zero)
  }

  required init?(coder: NSCoder) {
    nil
  }

  override func viewWillMove(toWindow newWindow: NSWindow?) {
    super.viewWillMove(toWindow: newWindow)
    guard newWindow == nil else { return }
    NSObject.cancelPreviousPerformRequests(withTarget: self)
    guard observedWindow != nil else { return }
    NotificationCenter.default.removeObserver(self)
    observedWindow = nil
  }

  override func viewDidMoveToWindow() {
    super.viewDidMoveToWindow()
    guard window != nil, observedWindow == nil else { return }
    perform(#selector(applyStoredFrame), with: nil, afterDelay: 0)
  }

  @objc private func applyStoredFrame() {
    guard let window, observedWindow == nil else { return }

    let stored = UserDefaults.standard.string(forKey: key).map(NSRectFromString)
    if let stored, stored.width > 0, stored.height > 0 {
      window.setFrame(stored, display: true)
    } else {
      window.setContentSize(defaultSize)
      window.center()
    }

    observedWindow = window
    UserDefaults.standard.set(NSStringFromRect(window.frame), forKey: key)
    for name in [NSWindow.didResizeNotification, NSWindow.didMoveNotification] {
      NotificationCenter.default.addObserver(
        self, selector: #selector(windowFrameChanged), name: name, object: window)
    }
  }

  @objc private func windowFrameChanged(_ notification: Notification) {
    guard let window = notification.object as? NSWindow else { return }
    UserDefaults.standard.set(NSStringFromRect(window.frame), forKey: key)
  }
}
