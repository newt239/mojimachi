import Foundation
import Testing

@testable import Mojimachi

@Suite("フォントの書き出し")
struct FontExportTests {
  private func style(path: String?, location: FontLocation = .user) -> FontStyle {
    FontStyle(
      postScriptName: path.map { ($0 as NSString).lastPathComponent } ?? "Unknown",
      styleName: "Regular",
      weight: 0,
      isItalic: false,
      isMonospaced: false,
      fileURL: path.map { URL(fileURLWithPath: $0) },
      location: location
    )
  }

  private func family(_ name: String, styles: [FontStyle]) -> FontFamily {
    FontFamily(name: name, styles: styles, supportsJapanese: false, searchKey: name.lowercased())
  }

  @Test("衝突しなければ名前を変えない")
  func keepsNameWithoutCollision() {
    #expect(FontExporter.uniqueName("Sample.ttf", taken: ["Other.ttf"]) == "Sample.ttf")
  }

  @Test("衝突したら連番を付ける")
  func appendsSuffixOnCollision() {
    #expect(FontExporter.uniqueName("Sample.ttf", taken: ["Sample.ttf"]) == "Sample 2.ttf")
  }

  @Test("空いている連番まで進む")
  func skipsTakenSuffixes() {
    #expect(
      FontExporter.uniqueName("Sample.ttf", taken: ["Sample.ttf", "Sample 2.ttf"])
        == "Sample 3.ttf"
    )
  }

  @Test("拡張子がなくても壊れない")
  func handlesNameWithoutExtension() {
    #expect(FontExporter.uniqueName("Sample", taken: ["Sample"]) == "Sample 2")
  }

  @Test("複数のドットを含む名前は最後の拡張子を保つ")
  func keepsLastExtension() {
    #expect(
      FontExporter.uniqueName("Sample.v2.ttf", taken: ["Sample.v2.ttf"]) == "Sample.v2 2.ttf"
    )
  }

  @Test("先頭のドットを拡張子として扱わない")
  func doesNotTreatLeadingDotAsExtension() {
    #expect(FontExporter.uniqueName(".hidden", taken: [".hidden"]) == ".hidden 2")
  }

  @Test("システムフォントを除外する")
  func excludesSystemFonts() {
    let plan = FontExporter.plan(for: [
      family(
        "Sample",
        styles: [
          style(path: "/System/Library/Fonts/System.ttf", location: .system),
          style(path: "/Users/newt/Library/Fonts/User.ttf"),
        ])
    ])

    #expect(plan.urls.map(\.lastPathComponent) == ["User.ttf"])
    #expect(plan.excludedSystemCount == 1)
  }

  @Test("優先度がシステム以外でもシステム配下なら除外する")
  func excludesFontsUnderSystemRegardlessOfPriority() {
    let plan = FontExporter.plan(for: [
      family(
        "Sample",
        styles: [style(path: "/System/Library/AssetsV2/PingFang.ttc", location: .process)])
    ])

    #expect(plan.isEmpty)
    #expect(plan.excludedSystemCount == 1)
  }

  @Test("同じファイルを指すスタイルを 1 件に畳む")
  func collapsesSharedFiles() {
    let shared = style(path: "/Users/newt/Library/Fonts/Shared.ttc")
    let plan = FontExporter.plan(for: [
      family("A", styles: [shared]),
      family("B", styles: [shared]),
    ])

    #expect(plan.urls.count == 1)
  }

  @Test("ファイルを特定できないスタイルを数える")
  func countsStylesWithoutFile() {
    let plan = FontExporter.plan(for: [family("Sample", styles: [style(path: nil)])])

    #expect(plan.isEmpty)
    #expect(plan.missingFileCount == 1)
  }

  @Test("ttc を警告対象として拾う")
  func detectsFontCollections() {
    let plan = FontExporter.plan(for: [
      family(
        "Sample",
        styles: [
          style(path: "/Users/newt/Library/Fonts/A.ttc"),
          style(path: "/Users/newt/Library/Fonts/B.ttf"),
        ])
    ])

    #expect(plan.collectionURLs.map(\.lastPathComponent) == ["A.ttc"])
    #expect(plan.hasCollections)
  }

  @Test("書き出し対象はパスの昇順に並ぶ")
  func sortsTargetsByPath() {
    let plan = FontExporter.plan(for: [
      family(
        "Sample",
        styles: [
          style(path: "/Users/newt/Library/Fonts/B.ttf"),
          style(path: "/Users/newt/Library/Fonts/A.ttf"),
        ])
    ])

    #expect(plan.urls.map(\.lastPathComponent) == ["A.ttf", "B.ttf"])
  }

  @Test("同名のファイルがあれば連番でコピーする")
  func copiesAlongsideExistingFile() async throws {
    let manager = FileManager.default
    let root = manager.temporaryDirectory.appending(path: UUID().uuidString)
    let source = root.appending(path: "source")
    let destination = root.appending(path: "destination")
    try manager.createDirectory(at: source, withIntermediateDirectories: true)
    try manager.createDirectory(at: destination, withIntermediateDirectories: true)
    defer { try? manager.removeItem(at: root) }

    let file = source.appending(path: "Sample.ttf")
    try Data("font".utf8).write(to: file)
    try Data("existing".utf8).write(to: destination.appending(path: "Sample.ttf"))

    let plan = FontExportPlan(
      urls: [file], excludedSystemCount: 0, missingFileCount: 0, collectionURLs: [])
    let result = await FontExporter().export(plan, to: destination)

    #expect(result.copied.count == 1)
    #expect(result.failed.isEmpty)
    #expect(manager.fileExists(atPath: destination.appending(path: "Sample 2.ttf").path))
  }

  @Test("コピーに失敗しても残りを続行する")
  func continuesAfterFailure() async throws {
    let manager = FileManager.default
    let root = manager.temporaryDirectory.appending(path: UUID().uuidString)
    let source = root.appending(path: "source")
    let destination = root.appending(path: "destination")
    try manager.createDirectory(at: source, withIntermediateDirectories: true)
    try manager.createDirectory(at: destination, withIntermediateDirectories: true)
    defer { try? manager.removeItem(at: root) }

    let existing = source.appending(path: "Real.ttf")
    try Data("font".utf8).write(to: existing)
    let missing = source.appending(path: "Missing.ttf")

    let plan = FontExportPlan(
      urls: [missing, existing], excludedSystemCount: 0, missingFileCount: 0, collectionURLs: [])
    let result = await FontExporter().export(plan, to: destination)

    #expect(result.copied.count == 1)
    #expect(result.failed == ["Missing.ttf"])
  }
}
