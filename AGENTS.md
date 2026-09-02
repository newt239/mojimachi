# Coding Agent Guidelines

## 目次

- [現在の状況](#現在の状況)
- [基本原則](#基本原則)
- [開発コマンド](#開発コマンド)
- [アーキテクチャ](#アーキテクチャ)
- [コーディングガイドライン](#コーディングガイドライン)
- [Swift ガイドライン](#swift-ガイドライン)
- [Rust ガイドライン](#rust-ガイドライン)
- [Git 運用](#git-運用)

## 現在の状況

このリポジトリは **Tauri + React から SwiftUI へ書き直している最中**です。

- `apple/` - SwiftUI 版。今後の実装はすべてここに行ってください
- `src/` `src-tauri/` - Tauri 版。**新規の変更は行わないでください**。移行完了後に削除します

後方互換や既存デザインの維持は考慮しません。SwiftUI 版はゼロから設計して構いません。

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

### SwiftUI 版

Xcode プロジェクトは`apple/project.yml`から XcodeGen で生成します。`.xcodeproj`はコミットしません。

- `make generate` - Xcode プロジェクトを生成
- `make build` - ビルド
- `make run` - ビルドして起動
- `make format` - swift-format で整形
- `make lint` - swift-format で検査
- `make codecheck` - lint とビルドをまとめて実行

実装後は必ず`make codecheck`を実行してください。

### Tauri 版（保守のみ）

- `pnpm run dev` - Vite 開発サーバーのみを起動（ブラウザでは Tauri command が使えないため通常は使わない）
- `pnpm run tauri dev` - デスクトップアプリとして開発起動
- `pnpm run tauri build` - 配布用バイナリをビルド
- `pnpm run typecheck` - TypeScript で型チェック
- `pnpm run codecheck` - 型チェック・Lint・フォーマット・未使用コード検出をまとめて実行
- `pnpm run rust:check` - Rust の fmt・clippy・test をまとめて実行

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

### プロジェクト構造

```bash
apple/
├── project.yml             XcodeGen のプロジェクト定義
└── Sources/
    ├── App/                エントリポイントとメニュー
    ├── Views/              画面
    └── Resources/          アセットカタログとローカライズ
```

### Tauri 版の構造（削除予定）

```bash
src/                        フロントエンド
├── app.tsx                 ルーティング定義とレイアウト
├── main.tsx                エントリポイント
├── components/             コンポーネント
├── pages/                  ページ単位のコンポーネント
├── hooks/                  カスタムフック
├── types/                  型定義
└── utils/                  ユーティリティと Jotai の atom

src-tauri/                  Rust バックエンド
├── src/
│   ├── main.rs             エントリポイントと Tauri command
│   └── mojimachi.rs        フォントソースの取得
├── icons/
└── tauri.conf.json
```

機能ベースのディレクトリ構成（`src/features/{feature-name}/`）への再編は今後行う予定です。新しい機能を追加する際は、既存の`components/`・`pages/`に合わせて配置してください。

- コンポーネントの名前は PascalCase で命名し、ファイル名とディレクトリ名は kebab-case で命名してください。
- コンポーネントごとにディレクトリを作らず、`{component-name}.tsx`として直接配置し、**名前付きエクスポート**してください。デフォルトエクスポートと`index.ts`による再エクスポートは行いません。

### インポートとパスエイリアス

- 同階層でないモジュールをインポートする場合は、**相対パスではなくパスエイリアスを使用してください**。
- プロジェクトでは`#/`が`src/`にマップされています。例: `#/components/header` → `src/components/header`。
- **同一ディレクトリ内**のインポートでは相対パスを使用して構いません。

### フロントエンドと Rust の責務分担

- **ファイルシステムやフォント情報へのアクセスはすべて Rust 側の command で行います**。フロントエンドから直接 OS のリソースに触れてはなりません。
- command の戻り値は Rust 側で`Result<T, String>`とし、フロントエンドでは失敗をユーザーに提示してください。無言で失敗させてはなりません。

## コーディングガイドライン

### `any`の禁止

- いかなる理由があっても`any`を使用してはなりません。
- `unknown`や`never`の使用も避けてください。
- 実データと一致する型を定義してください。

### 型アサーションの禁止

- 型アサーションは禁止です。
- 型アサーションを使用する場合は、明確な理由をコメントアウトとして記述してください。

### `interface`の禁止

- 型定義に`interface`を使用してはなりません。`type`を使用してください。

### コメントの禁止

- 原則としてコメントは記述してはなりません。
- 型アサーションや`useEffect`の使用理由など、他のガイドラインが記述を求める場合のみ例外とします。
- コメントを書く場合は括弧を使用しないでください。

### 過度な抽象化の禁止

- 無駄に関数化・定数化しすぎてはなりません。
- 再利用される明確な根拠がない限り、処理の切り出しや定数への抽出を行わないでください。

### `useEffect`によるデータ取得の禁止

- Tauri command からの初期データ取得に`useEffect`を使用してはなりません。
- データ取得はデータ取得用のフックに集約し、ローディングとエラーの状態を一元的に扱ってください。
- ブラウザ API アクセスやイベントリスナー登録など、真に必要な場合のみ`useEffect`の使用を許可します。この場合は明確な理由をコメントアウトとして記述してください。

### 状態の永続化

- ユーザーの設定（お気に入り・プレビュー文字列・表示モード・フォントサイズなど）は**必ず永続化してください**。アプリを再起動しても保持される必要があります。
- 永続化には Jotai の`atomWithStorage`または Tauri のストアプラグインを使用します。素の`atom`で設定値を保持してはなりません。

### `console.log`の禁止

- `console.log`をコミットしてはなりません。`console.warn`と`console.error`のみ許可します。

## Swift ガイドライン

### 強制アンラップの禁止

- `!`による強制アンラップと`try!`を使用してはなりません。`.swift-format`の`NeverForceUnwrap`と`NeverUseForceTry`で検査しています。
- 暗黙的アンラップ型（`Type!`）も使用してはなりません。
- **フォント単位の失敗はスキップし、一覧の取得自体は続行してください**。デバイス上には壊れたフォントや読み取れないフォントが必ず存在します。

### 命名とファイル配置

- 型名は UpperCamelCase、それ以外は lowerCamelCase で命名してください。
- 1 ファイル 1 型を原則とし、ファイル名は型名に合わせてください。
- `apple/Sources/App/`にアプリのエントリポイントとメニュー、`apple/Sources/Views/`に画面、`apple/Sources/`配下にその他を配置します。

### 並行性

- `SWIFT_STRICT_CONCURRENCY`を`complete`に設定しています。警告はエラー扱いです。
- UI に触れる型は`@MainActor`で隔離し、フォント列挙のような重い処理はアクター外で行ってください。

## Rust ガイドライン

### `unwrap()`と`expect()`の禁止

- `unwrap()`および`expect()`を使用してはなりません。デバイス上には壊れたフォントや読み取れないフォントが必ず存在し、1 つ失敗しただけでアプリ全体がパニックします。
- `?`・`ok_or_else`・`filter_map`などで適切に処理してください。
- **フォント単位の失敗はスキップし、一覧の取得自体は続行してください**。

### command の設計

- すべての`#[tauri::command]`は`Result<T, String>`を返してください。
- フロントエンドから呼ばれない command を残してはなりません。未使用の command は削除してください。
- ファイルパスを引数に取る command を追加してはなりません。任意ファイルの読み取りにつながります。

### ログ

- `println!`を使用してはなりません。ログ出力にはログプラグインを使用してください。

## Git 運用

### ブランチ命名規則

```text
{type}/{subject}

例:
- feat/font-search
- fix/family-page-crash
- refactor/feature-directory
```

### コミットメッセージ

- 1 行以内で書きます。本文は付けません。
- Conventional Commits の prefix（`feat:` / `fix:` / `chore:` / `docs:` / `refactor:` / `perf:` / `test:`）を付けます。
- 目的ごとにコミットを分けます。

```text
例:
- feat: フォント検索にデバウンスを追加
- fix: ファミリページでフォントが表示されない不具合を修正
- chore: oxlint を導入
```

### PR

- `.github/PULL_REQUEST_TEMPLATE.md`を必ず使用してください。
- Draft で作成し、CI 通過後に Ready for Review に変更してください。
