import CoreText

enum PreviewFont {
  static func make(
    postScriptName: String,
    size: CGFloat,
    variations: [Int: Double] = [:],
    features: [Int: Int] = [:]
  ) -> CTFont? {
    guard
      let font = FontDetails.font(
        postScriptName: postScriptName,
        size: size,
        variations: variations,
        features: features
      )
    else {
      return nil
    }
    let lastResort = CTFontDescriptorCreateWithAttributes(
      [kCTFontNameAttribute: "LastResort"] as CFDictionary
    )
    let descriptor = CTFontDescriptorCreateWithAttributes(
      [kCTFontCascadeListAttribute: [lastResort] as CFArray] as CFDictionary
    )
    return CTFontCreateCopyWithAttributes(font, size, nil, descriptor)
  }
}
