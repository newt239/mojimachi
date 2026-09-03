import SwiftUI

struct GlyphGridView: View {
  @Bindable var model: FontDetailModel

  var body: some View {
    VStack(spacing: 0) {
      controls
      Divider()
      content
      if let glyph = model.copiedGlyph {
        Divider()
        copiedBar(glyph)
      }
    }
  }

  private var controls: some View {
    HStack(spacing: 12) {
      Picker("ブロック", selection: $model.selectedBlockID) {
        ForEach(model.blocks) { entry in
          Text("\(entry.block.name)（\(entry.glyphs.count)）")
            .tag(UnicodeBlock.ID?.some(entry.id))
        }
      }
      .frame(maxWidth: 280)
      .disabled(model.isSearching || model.blocks.isEmpty)

      TextField("グリフまたはコードポイントを検索", text: $model.glyphSearchText)
        .textFieldStyle(.roundedBorder)
        .frame(maxWidth: 260)

      Spacer(minLength: 0)

      Text("\(model.glyphs.count) 字")
        .font(.callout)
        .foregroundStyle(.secondary)
    }
    .padding(12)
  }

  @ViewBuilder
  private var content: some View {
    if model.isLoadingGlyphs {
      ProgressView("グリフを調べています")
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    } else if model.glyphs.isEmpty {
      ContentUnavailableView(
        "該当するグリフがありません",
        systemImage: "character.magnify",
        description: Text(model.isSearching ? "検索条件を変えてみてください。" : "このフォントは収録字が読み取れませんでした。")
      )
    } else {
      ScrollView {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 64), spacing: 4)], spacing: 4) {
          ForEach(model.glyphs) { glyph in
            GlyphCell(
              glyph: glyph,
              font: glyphFont,
              isCopied: model.copiedGlyph == glyph,
              copy: { model.copy(glyph) }
            )
          }
        }
        .padding(12)
      }
    }
  }

  private var glyphFont: Font {
    model.font(size: 28)
  }

  private func copiedBar(_ glyph: FontGlyph) -> some View {
    HStack(spacing: 12) {
      Text(glyph.text)
        .font(model.font(size: 32))
      VStack(alignment: .leading, spacing: 2) {
        Text(glyph.codePoint)
          .font(.callout.monospaced())
        Text("コピーしました")
          .font(.caption)
          .foregroundStyle(.secondary)
      }
      Spacer(minLength: 0)
    }
    .padding(.horizontal, 12)
    .padding(.vertical, 8)
  }
}

private struct GlyphCell: View {
  let glyph: FontGlyph
  let font: Font
  let isCopied: Bool
  let copy: () -> Void

  var body: some View {
    Button(action: copy) {
      VStack(spacing: 2) {
        Text(glyph.text)
          .font(font)
          .frame(height: 40)
        Text(glyph.codePoint)
          .font(.system(size: 9).monospaced())
          .foregroundStyle(.secondary)
      }
      .frame(maxWidth: .infinity)
      .padding(.vertical, 4)
      .background(
        isCopied ? Color.accentColor.opacity(0.2) : Color.clear,
        in: RoundedRectangle(cornerRadius: 6)
      )
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .help("\(glyph.text) \(glyph.codePoint) をコピー")
  }
}
