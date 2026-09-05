import AppKit
import SwiftUI

struct VerticalTextView: NSViewRepresentable {
  let text: String
  let fontName: String
  let fontSize: Double

  func makeNSView(context: Context) -> NSTextView {
    let textView = NSTextView()
    textView.setLayoutOrientation(.vertical)
    textView.isEditable = false
    textView.isSelectable = true
    textView.drawsBackground = false
    textView.textContainerInset = .zero
    textView.textContainer?.lineFragmentPadding = 0
    textView.textContainer?.maximumNumberOfLines = 1
    return textView
  }

  func updateNSView(_ textView: NSTextView, context: Context) {
    textView.string = text
    textView.font = PreviewFont.make(postScriptName: fontName, size: fontSize) as NSFont?
    textView.textColor = .labelColor
  }
}
