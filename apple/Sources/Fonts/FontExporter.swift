import Foundation

actor FontExporter {
  func export(_ plan: FontExportPlan, to directory: URL) -> FontExportResult {
    let manager = FileManager.default
    var taken = Set(
      (try? manager.contentsOfDirectory(atPath: directory.path(percentEncoded: false))) ?? []
    )
    var copied: [URL] = []
    var failed: [String] = []

    for url in plan.urls {
      let name = Self.uniqueName(url.lastPathComponent, taken: taken)
      let destination = directory.appending(path: name)
      do {
        try manager.copyItem(at: url, to: destination)
        taken.insert(name)
        copied.append(destination)
      } catch {
        failed.append(url.lastPathComponent)
      }
    }

    return FontExportResult(copied: copied, failed: failed)
  }

  static func plan(for families: [FontFamily]) -> FontExportPlan {
    var exportable: Set<URL> = []
    var excluded: Set<URL> = []
    var missingFileCount = 0

    for style in families.flatMap(\.styles) {
      guard let url = style.fileURL?.standardizedFileURL else {
        missingFileCount += 1
        continue
      }
      // 場所の優先度はシステム内でも分かれるため、パスと併せて判定する
      if style.isSystemFont || !style.location.canExport {
        excluded.insert(url)
      } else {
        exportable.insert(url)
      }
    }

    let urls = exportable.sorted { $0.path(percentEncoded: false) < $1.path(percentEncoded: false) }
    return FontExportPlan(
      urls: urls,
      excludedSystemCount: excluded.count,
      missingFileCount: missingFileCount,
      collectionURLs: urls.filter { $0.pathExtension.lowercased() == "ttc" }
    )
  }

  static func uniqueName(_ name: String, taken: Set<String>) -> String {
    guard taken.contains(name) else { return name }

    let base: String
    let suffix: String
    if let dot = name.lastIndex(of: "."), dot != name.startIndex {
      base = String(name[name.startIndex..<dot])
      suffix = String(name[dot...])
    } else {
      base = name
      suffix = ""
    }

    for index in 2...999 {
      let candidate = "\(base) \(index)\(suffix)"
      if !taken.contains(candidate) {
        return candidate
      }
    }
    return "\(base) \(UUID().uuidString)\(suffix)"
  }
}
