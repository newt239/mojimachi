import AppKit
import CoreGraphics
import Testing

@testable import Mojimachi

@Suite("印刷のページ分割")
struct FontPrintLayoutTests {
  private let target = FontPrintTarget(
    familyName: "Sample", postScriptName: "Sample-Regular", styleName: "Regular")

  private func targets(_ count: Int) -> [FontPrintTarget] {
    (0..<count).map {
      FontPrintTarget(familyName: "Family \($0)", postScriptName: "F\($0)", styleName: "Regular")
    }
  }

  private func glyphs(_ count: Int) -> [FontGlyph] {
    (0..<count).compactMap { Unicode.Scalar(UInt32(0x4E00 + $0)).map(FontGlyph.init) }
  }

  private func catalogTargets(_ page: FontPrintPage) -> [FontPrintTarget] {
    guard case .catalog(let targets) = page else { return [] }
    return targets
  }

  private func repertoireGlyphs(_ page: FontPrintPage) -> [FontGlyph] {
    guard case .repertoire(_, let glyphs, _) = page else { return [] }
    return glyphs
  }

  private func waterfallSizes(_ page: FontPrintPage) -> [Double] {
    guard case .waterfall(_, let sizes) = page else { return [] }
    return sizes
  }

  @Test("高さから 1 ページの行数を求める")
  func calculatesRowsPerPage() {
    #expect(FontPrintLayout.rowsPerPage(contentHeight: 720, rowHeight: 72) == 10)
  }

  @Test("1 行も入らない高さでも 1 行は割り当てる")
  func keepsAtLeastOneRow() {
    #expect(FontPrintLayout.rowsPerPage(contentHeight: 10, rowHeight: 72) == 1)
  }

  @Test("行の高さが 0 でも落ちない")
  func survivesZeroRowHeight() {
    #expect(FontPrintLayout.rowsPerPage(contentHeight: 720, rowHeight: 0) == 1)
  }

  @Test("セルの大きさから格子の容量を求める")
  func calculatesGridCapacity() {
    let capacity = FontPrintLayout.gridCapacity(
      contentSize: CGSize(width: 400, height: 600),
      cellSize: CGSize(width: 40, height: 60)
    )

    #expect(capacity.columns == 10)
    #expect(capacity.rows == 10)
  }

  @Test("セルの大きさが 0 でも落ちない")
  func survivesZeroCellSize() {
    let capacity = FontPrintLayout.gridCapacity(
      contentSize: CGSize(width: 400, height: 600), cellSize: .zero)

    #expect(capacity.columns == 1)
    #expect(capacity.rows == 1)
  }

  @Test("カタログを行数で分割する")
  func splitsCatalogPages() {
    let pages = FontPrintLayout.catalogPages(targets(20), rowsPerPage: 8)

    #expect(pages.count == 3)
    #expect(pages.map { catalogTargets($0).count } == [8, 8, 4])
  }

  @Test("カタログの分割で書体が失われない")
  func keepsEveryCatalogTarget() {
    let all = targets(20)
    let pages = FontPrintLayout.catalogPages(all, rowsPerPage: 7)

    #expect(pages.flatMap { catalogTargets($0) } == all)
  }

  @Test("対象がなければカタログは 0 ページになる")
  func returnsNoCatalogPageWithoutTargets() {
    #expect(FontPrintLayout.catalogPages([], rowsPerPage: 8).isEmpty)
  }

  @Test("グリフ格子の容量ちょうどなら端数ページが出ない")
  func splitsRepertoireWithoutRemainder() {
    let pages = FontPrintLayout.repertoirePages(
      target, glyphs: glyphs(100), columns: 10, rows: 10)

    #expect(pages.count == 1)
  }

  @Test("グリフの端数は最後のページに入る")
  func putsRemainingGlyphsOnLastPage() {
    let pages = FontPrintLayout.repertoirePages(
      target, glyphs: glyphs(105), columns: 10, rows: 10)

    #expect(pages.count == 2)
    #expect(repertoireGlyphs(pages[1]).count == 5)
  }

  @Test("グリフの総数が分割で変わらない")
  func keepsEveryGlyph() {
    let all = glyphs(2500)
    let pages = FontPrintLayout.repertoirePages(target, glyphs: all, columns: 12, rows: 18)

    #expect(pages.flatMap { repertoireGlyphs($0) } == all)
  }

  @Test("グリフがなければ 0 ページになる")
  func returnsNoRepertoirePageWithoutGlyphs() {
    #expect(FontPrintLayout.repertoirePages(target, glyphs: [], columns: 10, rows: 10).isEmpty)
  }

  @Test("ウォーターフォールは高さの累積で分割する")
  func splitsWaterfallByAccumulatedHeight() {
    let pages = FontPrintLayout.waterfallPages(
      target, sizes: FontPrintLayout.waterfallSizes, contentHeight: 700, lineSpacing: 22)

    #expect(pages.count > 1)
    #expect(pages.flatMap { waterfallSizes($0) } == FontPrintLayout.waterfallSizes)
  }

  @Test("1 行も入らない高さでも 1 サイズずつ配置する")
  func placesOneSizePerPageWhenSpaceIsTight() {
    let pages = FontPrintLayout.waterfallPages(
      target, sizes: [24, 36, 48], contentHeight: 1, lineSpacing: 0)

    #expect(pages.count == 3)
  }

  @Test("サイズがなければ 0 ページになる")
  func returnsNoWaterfallPageWithoutSizes() {
    #expect(
      FontPrintLayout.waterfallPages(
        target, sizes: [], contentHeight: 700, lineSpacing: 22
      ).isEmpty
    )
  }

  @Test("カタログを PDF として描画できる")
  @MainActor
  func rendersCatalogAsPDF() {
    let pages = FontPrintLayout.catalogPages(
      [
        FontPrintTarget(
          familyName: "Helvetica", postScriptName: "Helvetica", styleName: "Regular")
      ],
      rowsPerPage: 8
    )
    let view = FontPrintView(
      pages: pages,
      pageSize: NSSize(width: 595, height: 842),
      sampleText: "あのイーハトーヴォのすきとおった風",
      sampleSize: 18
    )

    #expect(view.dataWithPDF(inside: view.bounds).count > 1000)
  }

  @Test("グリフ格子を PDF として描画できる")
  @MainActor
  func rendersRepertoireAsPDF() {
    let pages = FontPrintLayout.repertoirePages(
      FontPrintTarget(
        familyName: "Helvetica", postScriptName: "Helvetica", styleName: "Regular"),
      glyphs: glyphs(120),
      columns: 12,
      rows: 10
    )
    let view = FontPrintView(
      pages: pages,
      pageSize: NSSize(width: 595, height: 842),
      sampleText: "Sample",
      sampleSize: 18
    )

    #expect(view.dataWithPDF(inside: view.bounds).count > 1000)
  }

  @Test("印刷ビューはページ数ぶんの高さを持つ")
  @MainActor
  func sizesViewForEveryPage() {
    let pages = FontPrintLayout.catalogPages(targets(20), rowsPerPage: 8)
    let view = FontPrintView(
      pages: pages, pageSize: NSSize(width: 595, height: 842), sampleText: "A", sampleSize: 18)

    #expect(pages.count == 3)
    #expect(view.frame.height == 2526)
    #expect(view.rectForPage(2).minY == 842)
  }

  @Test("ウォーターフォールのサイズ段階は昇順で重複しない")
  func keepsWaterfallSizesSortedAndUnique() {
    let sizes = FontPrintLayout.waterfallSizes

    #expect(sizes == sizes.sorted())
    #expect(Set(sizes).count == sizes.count)
  }
}
