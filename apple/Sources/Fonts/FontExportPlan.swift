import Foundation

struct FontExportPlan: Sendable, Equatable {
  let urls: [URL]
  let excludedSystemCount: Int
  let missingFileCount: Int
  let collectionURLs: [URL]

  var isEmpty: Bool { urls.isEmpty }

  var hasCollections: Bool { !collectionURLs.isEmpty }
}
