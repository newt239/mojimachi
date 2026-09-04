struct FontCharacterSetCoverage: Hashable, Sendable, Identifiable {
  let characterSet: JapaneseCharacterSet
  let coveredCount: Int

  var id: String { characterSet.id }

  var missingCount: Int { characterSet.count - coveredCount }

  var ratio: Double {
    characterSet.count == 0 ? 0 : Double(coveredCount) / Double(characterSet.count)
  }
}
