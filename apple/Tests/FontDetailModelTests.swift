import AppKit
import Foundation
import Testing

@testable import Mojimachi

@Suite("フォント詳細画面")
@MainActor
struct FontDetailModelTests {
  private func makeDefaults(_ name: String) throws -> UserDefaults {
    let suiteName = "dev.newt239.mojimachi.tests.detail.\(name)"
    UserDefaults().removePersistentDomain(forName: suiteName)
    return try #require(UserDefaults(suiteName: suiteName))
  }

  private func loadedModel(_ name: String) async throws -> FontDetailModel {
    let families = try await FontCatalog().families()
    let family = try #require(families.first { $0.name == "Helvetica Neue" })
    let model = FontDetailModel(
      family: family,
      style: family.representativeStyle,
      defaults: try makeDefaults(name)
    )
    model.load()

    for _ in 0..<200 where model.isLoadingGlyphs {
      try await Task.sleep(for: .milliseconds(25))
    }
    #expect(!model.isLoadingGlyphs)
    return model
  }

  @Test("コードポイントでグリフを検索できる")
  func searchesByCodePoint() async throws {
    let model = try await loadedModel("search-code-point")

    model.glyphSearchText = "U+0041"
    #expect(model.glyphs.map(\.text) == ["A"])

    model.glyphSearchText = "3042"
    #expect(model.glyphs.isEmpty)
  }

  @Test("グリフそのものを検索できる")
  func searchesByCharacter() async throws {
    let model = try await loadedModel("search-character")

    model.glyphSearchText = "Z"
    #expect(model.glyphs.map(\.text) == ["Z"])
  }

  @Test("検索していないときは選択中のブロックだけを表示する")
  func showsSelectedBlockOnly() async throws {
    let model = try await loadedModel("selected-block")
    let block = try #require(model.selectedBlock)

    #expect(!model.isSearching)
    #expect(model.glyphs == block.glyphs)
    #expect(model.glyphCount >= block.glyphs.count)
  }

  @Test("軸を動かしてから既定値に戻せる")
  func resetsAxes() async throws {
    let model = try await loadedModel("reset-axes")

    model.axisValues[0x7767_6874] = 700
    model.resetAxes()

    #expect(model.axisValues.count == model.axes.count)
    for axis in model.axes {
      #expect(model.axisValues[axis.identifier] == axis.defaultValue)
    }
  }

  @Test("ためしがきの設定が再起動後も保持される")
  func restoresSampleSettings() throws {
    let defaults = try makeDefaults("sample-settings")
    let family = FontFamily(name: "Test", styles: [], supportsJapanese: false, searchKey: "test")

    let first = FontDetailModel(family: family, style: nil, defaults: defaults)
    first.tab = .sample
    first.sampleText = "永"
    first.sampleSize = 96
    first.lineSpacing = 24
    first.foreground = .systemRed
    first.background = .systemBlue

    let second = FontDetailModel(family: family, style: nil, defaults: defaults)

    #expect(second.tab == .sample)
    #expect(second.sampleText == "永")
    #expect(second.sampleSize == 96)
    #expect(second.lineSpacing == 24)
    #expect(second.foreground.usingColorSpace(.sRGB) == NSColor.systemRed.usingColorSpace(.sRGB))
    #expect(second.background.usingColorSpace(.sRGB) == NSColor.systemBlue.usingColorSpace(.sRGB))
  }

  @Test("初回はためしがきの既定値を使う")
  func usesSampleDefaults() throws {
    let family = FontFamily(name: "Test", styles: [], supportsJapanese: false, searchKey: "test")
    let model = FontDetailModel(
      family: family,
      style: nil,
      defaults: try makeDefaults("sample-first-launch")
    )

    #expect(model.tab == .info)
    #expect(model.sampleText == FontDetailModel.defaultSampleText)
    #expect(model.sampleSize == 36)
    #expect(model.lineSpacing == 8)
  }
}
