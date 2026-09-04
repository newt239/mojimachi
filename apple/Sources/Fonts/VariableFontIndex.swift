import CoreText
import Foundation

final class VariableFontIndex: @unchecked Sendable {
  static let shared = VariableFontIndex()

  private let lock = NSLock()
  private var descriptors: [String: CTFontDescriptor]?

  func descriptor(forPostScriptName postScriptName: String) -> CTFontDescriptor? {
    lock.lock()
    defer { lock.unlock() }
    if descriptors == nil {
      descriptors = Self.build()
    }
    return descriptors?[postScriptName]
  }

  private static func build() -> [String: CTFontDescriptor] {
    let collection = CTFontCollectionCreateFromAvailableFonts(nil)
    guard
      let all = CTFontCollectionCreateMatchingFontDescriptors(collection) as? [CTFontDescriptor]
    else {
      return [:]
    }

    var result: [String: CTFontDescriptor] = [:]
    for descriptor in all {
      guard
        let name = CTFontDescriptorCopyAttribute(descriptor, kCTFontNameAttribute) as? String,
        result[name] == nil,
        let axes = CTFontDescriptorCopyAttribute(descriptor, kCTFontVariationAxesAttribute)
          as? [[String: Any]],
        !axes.isEmpty
      else {
        continue
      }
      result[name] = descriptor
    }
    return result
  }
}
