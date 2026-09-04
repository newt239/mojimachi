import SwiftUI

struct FontDuplicateRowView: View {
  let model: FontBrowserModel
  let duplicate: FontDuplicate

  var body: some View {
    DisclosureGroup {
      ForEach(duplicate.candidates) { candidate in
        FontDuplicateCandidateRow(model: model, candidate: candidate)
      }
    } label: {
      HStack(spacing: 8) {
        Text(duplicate.postScriptName)
          .font(.headline)

        Text("\(duplicate.candidates.count) 件")
          .font(.caption)
          .foregroundStyle(.secondary)

        if !duplicate.familyNames.isEmpty {
          Text(duplicate.familyNames.joined(separator: " / "))
            .font(.caption)
            .foregroundStyle(.tertiary)
            .lineLimit(1)
        }
      }
      .padding(.vertical, 2)
    }
  }
}

private struct FontDuplicateCandidateRow: View {
  let model: FontBrowserModel
  let candidate: FontDuplicateCandidate

  var body: some View {
    HStack(alignment: .firstTextBaseline, spacing: 12) {
      VStack(alignment: .leading, spacing: 2) {
        HStack(spacing: 8) {
          Text(candidate.style.location.label)
            .font(.caption)
            .foregroundStyle(.secondary)

          if candidate.isActive {
            Text("使用中")
              .font(.caption2)
              .padding(.horizontal, 6)
              .padding(.vertical, 2)
              .background(Color.accentColor.opacity(0.2), in: Capsule())
          }
        }

        Text(candidate.path)
          .font(.caption.monospaced())
          .foregroundStyle(.secondary)
          .textSelection(.enabled)
          .lineLimit(2)
          .truncationMode(.middle)
      }

      Spacer(minLength: 0)

      Button {
        guard let url = candidate.style.fileURL else { return }
        model.revealInFinder(url)
      } label: {
        Image(systemName: "folder")
      }
      .buttonStyle(.plain)
      .help("Finder で表示")
      .accessibilityLabel("Finder で表示")
      .disabled(candidate.style.fileURL == nil)
    }
    .padding(.vertical, 4)
  }
}
