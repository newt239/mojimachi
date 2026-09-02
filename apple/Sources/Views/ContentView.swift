import SwiftUI

struct ContentView: View {
  var body: some View {
    ContentUnavailableView {
      Label("もじまち", systemImage: "textformat")
    } description: {
      Text("フォント一覧はこれから実装します。")
    }
    .frame(minWidth: 720, minHeight: 480)
  }
}

#Preview {
  ContentView()
}
