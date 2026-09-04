import Foundation
import Testing

@testable import Mojimachi

@Suite("重複フォントの検出")
struct FontDuplicateTests {
  private func candidate(
    _ postScriptName: String,
    family: String = "Sample",
    path: String?,
    location: FontLocation = .system
  ) -> FontDuplicateCandidate {
    FontDuplicateCandidate(
      familyName: family,
      style: FontStyle(
        postScriptName: postScriptName,
        styleName: "Regular",
        weight: 0,
        isItalic: false,
        isMonospaced: false,
        fileURL: path.map { URL(fileURLWithPath: $0) },
        location: location
      )
    )
  }

  @Test("同じ PostScript 名が別ファイルにあれば重複になる")
  func detectsDuplicateAcrossFiles() throws {
    let duplicates = FontCatalog.duplicates(from: [
      candidate("Sample-Regular", path: "/a/Sample.ttc"),
      candidate("Sample-Regular", path: "/b/SampleUI.ttc"),
    ])

    let duplicate = try #require(duplicates.first)
    #expect(duplicates.count == 1)
    #expect(duplicate.postScriptName == "Sample-Regular")
    #expect(duplicate.candidates.count == 2)
  }

  @Test("同じファイルの同じ face は重複にしない")
  func ignoresSameFile() {
    let duplicates = FontCatalog.duplicates(from: [
      candidate("Sample-Regular", path: "/a/Sample.ttc"),
      candidate("Sample-Regular", family: "Sample UI", path: "/a/Sample.ttc"),
    ])

    #expect(duplicates.isEmpty)
  }

  @Test("ファイルが特定できない候補は 1 件に畳む")
  func collapsesCandidatesWithoutFile() {
    let duplicates = FontCatalog.duplicates(from: [
      candidate("Sample-Regular", path: nil),
      candidate("Sample-Regular", path: nil),
    ])

    #expect(duplicates.isEmpty)
  }

  @Test("優先度の高い候補が使用中になる")
  func marksHighestPriorityAsActive() throws {
    let duplicates = FontCatalog.duplicates(from: [
      candidate("Sample-Regular", path: "/system/Sample.ttf", location: .system),
      candidate("Sample-Regular", path: "/user/Sample.ttf", location: .user),
    ])

    let active = try #require(duplicates.first?.activeCandidate)
    #expect(active.style.location == .user)
  }

  @Test("使用中の候補は重複解決の勝者と一致する")
  func matchesDeduplicationWinner() throws {
    let candidates = [
      candidate("Sample-Regular", path: "/system/Sample.ttf", location: .system),
      candidate("Sample-Regular", path: "/user/Sample.ttf", location: .user),
    ]

    let active = try #require(FontCatalog.duplicates(from: candidates).first?.activeCandidate)
    let winner = try #require(FontCatalog.deduplicated(candidates.map(\.style)).first)

    #expect(active.style == winner)
  }

  @Test("候補の id が衝突しない")
  func keepsCandidateIdentifiersUnique() throws {
    let duplicate = try #require(
      FontCatalog.duplicates(from: [
        candidate("Sample-Regular", path: "/a/Sample.ttc"),
        candidate("Sample-Regular", path: "/b/SampleUI.ttc"),
      ]).first
    )

    #expect(Set(duplicate.candidates.map(\.id)).count == duplicate.candidates.count)
  }

  @Test("すべてシステムの重複を判別できる")
  func detectsSystemOnlyDuplicates() throws {
    let systemOnly = try #require(
      FontCatalog.duplicates(from: [
        candidate("Sample-Regular", path: "/System/Library/Fonts/Sample.ttc"),
        candidate("Sample-Regular", path: "/System/Library/AssetsV2/SampleUI.ttc"),
      ]).first
    )
    let mixed = try #require(
      FontCatalog.duplicates(from: [
        candidate("Other-Regular", path: "/System/Library/Fonts/Other.ttf"),
        candidate("Other-Regular", path: "/Users/newt/Library/Fonts/Other.ttf"),
      ]).first
    )

    #expect(systemOnly.isSystemOnly)
    #expect(!mixed.isSystemOnly)
  }

  @Test("システムかどうかは優先度ではなくパスで決まる")
  func judgesSystemByPathNotPriority() throws {
    let duplicate = try #require(
      FontCatalog.duplicates(from: [
        candidate(
          "PingFangSC-Regular", path: "/System/Library/AssetsV2/PingFang.ttc",
          location: .process),
        candidate(
          "PingFangSC-Regular",
          path: "/System/Library/PrivateFrameworks/FontServices.framework/PingFangUI.ttc",
          location: .system),
      ]).first
    )

    #expect(duplicate.isSystemOnly)
  }

  @Test("重複がなければ空を返す")
  func returnsEmptyWithoutDuplicates() {
    #expect(
      FontCatalog.duplicates(from: [
        candidate("A-Regular", path: "/a/A.ttf"),
        candidate("B-Regular", path: "/b/B.ttf"),
      ]).isEmpty
    )
  }

  @Test("入力の順序を変えても結果が変わらない")
  func staysStableRegardlessOfInputOrder() {
    let candidates = [
      candidate("Sample-Regular", path: "/system/Sample.ttf", location: .system),
      candidate("Sample-Regular", path: "/user/Sample.ttf", location: .user),
      candidate("Other-Regular", path: "/a/Other.ttf", location: .user),
      candidate("Other-Regular", path: "/b/Other.ttf", location: .computer),
    ]

    #expect(
      FontCatalog.duplicates(from: candidates)
        == FontCatalog.duplicates(from: candidates.reversed()))
  }

  @Test("またがるファミリー名を重複なく返す")
  func listsFamilyNamesWithoutRepetition() throws {
    let duplicate = try #require(
      FontCatalog.duplicates(from: [
        candidate("Sample-Regular", family: "PingFang SC", path: "/a/PingFang.ttc"),
        candidate("Sample-Regular", family: "PingFang SC", path: "/b/PingFangUI.ttc"),
        candidate("Sample-Regular", family: "PingFang TC", path: "/c/PingFangOther.ttc"),
      ]).first
    )

    #expect(duplicate.familyNames == ["PingFang SC", "PingFang TC"])
  }

  @Test("実機の走査でファミリーと重複を同時に取得できる")
  func scansFamiliesAndDuplicatesTogether() throws {
    let scan = try FontCatalog.scanAvailableFonts()

    #expect(!scan.families.isEmpty)
    #expect(scan.duplicates.allSatisfy { $0.candidates.count > 1 })
    #expect(scan.duplicates.allSatisfy { $0.candidates.filter(\.isActive).count == 1 })
  }
}
