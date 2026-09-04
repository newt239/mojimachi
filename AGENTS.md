# Coding Agent Guidelines

## 目次

- [基本原則](#基本原則)
- [開発コマンド](#開発コマンド)
- [アーキテクチャ](#アーキテクチャ)
- [Swift ガイドライン](#swift-ガイドライン)
- [配布](#配布)
- [Git 運用](#git-運用)

## 基本原則

- 常に日本語でコミュニケーションを行ってください。すべてのコミットメッセージ、コメント、エラーメッセージ、ユーザーとのやり取りは日本語で行ってください。
- ファイルの削除を行う場合は、必ず実行前に以下を報告し、明示的なユーザー承認を得てください。
  - 対象ファイルのリスト
  - 実行する変更の詳細説明
  - 影響範囲の説明
- 不明な点がある場合は常に質問し、推測で進めてはなりません。
- 実装後の必須作業として、`make codecheck`を実行してください。
  - エラーが出た場合は、コミット前に必ず修正してください。
  - エラーを解消するために`.swift-format`を変更してはなりません。

## 開発コマンド

Xcode プロジェクトは`apple/project.yml`から XcodeGen で生成します。`.xcodeproj`と`apple/Info.plist`はコミットしません。

- `make generate` - Xcode プロジェクトを生成
- `make build` - ビルド
- `make run` - ビルドして起動
- `make test` - テスト
- `make format` - swift-format で整形
- `make lint` - swift-format で検査
- `make codecheck` - lint・ビルド・テストをまとめて実行

実装後は必ず`make codecheck`を実行してください。

### 動作確認

- 実装した画面は`make run`で実際に起動して確認してください。
- スクリーンショット等の検証用ファイルはプロジェクトルート直下に置かないでください。

## アーキテクチャ

### 技術スタック

- **言語**: Swift
- **UI**: SwiftUI
- **プロジェクト生成**: XcodeGen
- **依存管理**: SwiftPM
- **コード品質**: swift-format（Xcode 同梱）
- **フォント読み取り**: CoreText
- **自動アップデート**: Sparkle

### プロジェクト構造

```bash
apple/
├── project.yml             XcodeGen のプロジェクト定義
├── Sources/
│   ├── App/                エントリポイントとメニュー
│   ├── Fonts/              CoreText によるフォント読み取り
│   ├── State/              画面の状態
│   ├── Views/              画面
│   └── Resources/          アセットカタログとローカライズ
└── Tests/                  テスト
```

### 責務分担

- **フォントの読み取りは`Sources/Fonts/`に閉じ込めてください**。`Views/`から CoreText を直接呼んではなりません。
- 重い列挙処理はアクターに置き、`@MainActor`の状態型から`await`で呼んでください。

### 状態の永続化

- ユーザーの設定（お気に入り・プレビュー文字列・表示モード・フォントサイズ・ウィンドウ位置など）は**必ず永続化してください**。アプリを再起動しても保持される必要があります。
- 永続化には`UserDefaults`を使い、`didSet`で書き込み、`init`で読み戻します。テストのために`UserDefaults`を注入できる形にしてください。

## Swift ガイドライン

### 強制アンラップの禁止

- `!`による強制アンラップと`try!`を使用してはなりません。`.swift-format`の`NeverForceUnwrap`と`NeverUseForceTry`で検査しています。
- 暗黙的アンラップ型（`Type!`）も使用してはなりません。
- **フォント単位の失敗はスキップし、一覧の取得自体は続行してください**。デバイス上には壊れたフォントや読み取れないフォントが必ず存在します。

### コメント

- 原則としてコメントは記述してはなりません。コードを読めば分かることは書かないでください。
- 書く場合も 1 行以内にとどめてください。

### 過度な抽象化の禁止

- 無駄に関数化・定数化しすぎてはなりません。
- 再利用される明確な根拠がない限り、処理の切り出しや定数への抽出を行わないでください。

### 命名とファイル配置

- 型名は UpperCamelCase、それ以外は lowerCamelCase で命名してください。
- 1 ファイル 1 型を原則とし、ファイル名は型名に合わせてください。

### 並行性

- `SWIFT_STRICT_CONCURRENCY`を`complete`に設定しています。警告はエラー扱いです。
- UI に触れる型は`@MainActor`で隔離し、フォント列挙のような重い処理はアクター外で行ってください。

### アクセシビリティ

- 記号だけのボタンには`.accessibilityLabel`を付けてください。付け忘れると VoiceOver が SF Symbol 名をそのまま読み上げます。

## 配布

- `v`から始まるタグを push すると、GitHub Actions が`.dmg`を作ってドラフトリリースを用意します。
- **署名と公証は行っていません**。利用者は初回起動時に Gatekeeper の回避が必要です。
- 自動アップデートの有効化手順は`docs/sparkle.md`を参照してください。`SUPublicEDKey`が空のあいだは無効のままです。

## Git 運用

### ブランチ命名規則

```text
{type}/{subject}

例:
- feat/font-search
- fix/family-page-crash
- chore/xcode-distribution
```

### コミットメッセージ

- 1 行以内で書きます。本文は付けません。
- Conventional Commits の prefix（`feat:` / `fix:` / `chore:` / `docs:` / `refactor:` / `perf:` / `test:`）を付けます。
- 目的ごとにコミットを分けます。

```text
例:
- feat: フォント検索にデバウンスを追加
- fix: ファミリページでフォントが表示されない不具合を修正
- chore: 配布フローを Xcode ベースに移行
```

### PR

- `.github/PULL_REQUEST_TEMPLATE.md`を必ず使用してください。
- Draft で作成し、CI 通過後に Ready for Review に変更してください。
