import CoreText
import Testing

@testable import Mojimachi

@Suite("インストール場所")
struct FontLocationTests {
  @Test("優先度から場所を判定する")
  func mapsPriority() {
    #expect(FontLocation(priority: Int(kCTFontPrioritySystem)) == .system)
    #expect(FontLocation(priority: Int(kCTFontPriorityNetwork)) == .network)
    #expect(FontLocation(priority: Int(kCTFontPriorityComputer)) == .computer)
    #expect(FontLocation(priority: Int(kCTFontPriorityUser)) == .user)
    #expect(FontLocation(priority: Int(kCTFontPriorityDynamic)) == .dynamic)
    #expect(FontLocation(priority: Int(kCTFontPriorityProcess)) == .process)
  }

  @Test("未知の優先度は不明として扱う")
  func fallsBackToUnknown() {
    #expect(FontLocation(priority: 0) == .unknown)
    #expect(FontLocation(priority: 12345) == .unknown)
  }

  @Test("システムフォントは書き出せない")
  func systemCannotBeExported() {
    #expect(FontLocation.system.canExport == false)
    #expect(FontLocation.user.canExport)
    #expect(FontLocation.computer.canExport)
  }

  @Test("優先度は場所の解決順に対応する")
  func priorityOrdersLocations() {
    #expect(FontLocation.user.priority > FontLocation.system.priority)
    #expect(FontLocation.process.priority > FontLocation.user.priority)
    #expect(FontLocation.unknown.priority == 0)
  }
}
