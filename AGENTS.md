# Coding Agent Guidelines

## 目次

- [基本原則](#基本原則)
- [開発コマンド](#開発コマンド)
- [アーキテクチャ](#アーキテクチャ)
- [TypeScript ガイドライン](#typescript-ガイドライン)
- [Rust ガイドライン](#rust-ガイドライン)
- [配布](#配布)
- [Git 運用](#git-運用)

## 基本原則

- 常に日本語でコミュニケーションを行ってください。すべてのコミットメッセージ、コメント、エラーメッセージ、ユーザーとのやり取りは日本語で行ってください。
- ファイルの削除を行う場合は、必ず実行前に以下を報告し、明示的なユーザー承認を得てください。
  - 対象ファイルのリスト
  - 実行する変更の詳細説明
  - 影響範囲の説明
- 不明な点がある場合は常に質問し、推測で進めてはなりません。
- 実装後の必須作業として、`pnpm codecheck`を実行してください。
  - エラーが出た場合は、コミット前に必ず修正してください。
  - エラーを解消するために`.oxlintrc.json`や`.oxfmtrc.json`を変更してはなりません。

## 開発コマンド

| コマンド          | 内容                              |
| ----------------- | --------------------------------- |
| `pnpm dev`        | アプリを開発モードで起動          |
| `pnpm build`      | アプリをビルドして配布物を作る    |
| `pnpm lint`       | oxlint・oxfmt・型検査             |
| `pnpm format`     | oxfmt で整形                      |
| `pnpm test`       | Vitest                            |
| `pnpm cargo:lint` | cargo fmt --check と clippy       |
| `pnpm cargo:test` | cargo test                        |
| `pnpm codecheck`  | 上記の lint・テストをまとめて実行 |

実装後は必ず`pnpm codecheck`を実行してください。

### 動作確認

- 実装した画面は`pnpm dev`で実際に起動して確認してください。
- 3 OS 対応のため、**OS 固有の分岐を書いたときは該当 OS での確認をユーザーに依頼してください**。
- スクリーンショット等の検証用ファイルはプロジェクトルート直下に置かないでください。

## アーキテクチャ

### 技術スタック

- **言語**: TypeScript / Rust
- **アプリ基盤**: Tauri v2（macOS・Windows・Linux）
- **UI**: React + Radix UI Primitives + Tailwind CSS
- **状態管理**: jotai
- **ビルド**: Vite
- **コード品質**: oxlint・oxfmt・knip / rustfmt・clippy
- **フォント読み取り**: fontations（`read-fonts` / `skrifa`）によるファイル直接パース

### プロジェクト構造

```bash
src/                       フロントエンド
├── routes/                画面
├── features/              機能単位のコンポーネントと状態
├── components/            汎用 UI 部品
├── lib/                   IPC ラッパーと純粋ロジック
└── styles/                グローバル CSS と Tofu フォント

src-tauri/                 バックエンド
├── capabilities/          Tauri の権限定義
├── icons/                 アプリアイコン
└── src/
    ├── font/              フォントの走査・パース・カバレッジ
    ├── manage/            インストール / アンインストール（OS 別）
    ├── protocol.rs        fontface:// スキーム
    └── menu.rs            ネイティブメニュー
```

### 責務分担

- **フォントの読み取りは`src-tauri/src/font/`に閉じ込めてください**。フロントエンドから直接フォントファイルを読んではなりません。
- **OS のフォント API（CoreText・DirectWrite・fontconfig）に依存してはなりません**。3 OS で挙動を揃えるため、フォントファイルを自前でパースします。
- **OS 固有の処理は`#[cfg(target_os = ...)]`でモジュールごと切り分け、共通トレイト経由で呼んでください**。非対象 OS でパニックするコードを書いてはなりません。
- 重い列挙処理はコマンドを`async`にし、`rayon`で並列化してください。

### フォントの描画

- プレビューは**`fontface://`カスタムプロトコルで配信した単一 face の sfnt**を`@font-face`で参照します。CSS の`local()`を使ってはなりません（Windows でユーザー領域のフォントが描画できなくなります）。
- `.ttc`はブラウザが先頭 face しか読まないため、Rust 側で face を取り出して単一 sfnt に再パッケージしてから返します。
- 未収録文字は`font-family: var(--mj-face), Tofu`で豆腐に落とします。代替フォントにフォールバックさせてはなりません。
- `font-synthesis: none`を必ず指定し、偽ボールド・偽イタリックを抑止してください。ウエイトと斜体は実在する face を選び直すことで表現します。

### 状態の永続化

- ユーザーの設定（お気に入り・コレクション・プレビュー文字列・表示モード・フォントサイズなど）は**必ず永続化してください**。アプリを再起動しても保持される必要があります。
- 永続化には`tauri-plugin-store`を使います。`localStorage`は WebView のデータ消去で失われるため、ユーザーの資産（お気に入り・コレクション）を預けてはなりません。
- お気に入りとコレクションは`library.json`、表示設定は`settings.json`に分けます。

## TypeScript ガイドライン

### 型の安全性

- `any`と非 null アサーション（`!`）を使用してはなりません。`.oxlintrc.json`の`typescript/no-non-null-assertion`と`typescript/no-unsafe-type-assertion`で検査しています。
- `strict`と`noUncheckedIndexedAccess`を有効にしています。

### コメント

- 原則としてコメントは記述してはなりません。コードを読めば分かることは書かないでください。
- 書く場合も 1 行以内にとどめてください。

### 過度な抽象化の禁止

- 無駄に関数化・定数化しすぎてはなりません。
- 再利用される明確な根拠がない限り、処理の切り出しや定数への抽出を行わないでください。

### 命名とファイル配置

- ファイル名は kebab-case、React コンポーネントは PascalCase で命名してください。
- コンポーネントはアロー関数で定義してください。

## Rust ガイドライン

### エラー処理

- `unwrap()`と`expect()`を使用してはなりません（`main.rs`の起動時を除く）。`clippy`を`-D warnings`で走らせています。
- **フォント単位の失敗はスキップし、一覧の取得自体は続行してください**。デバイス上には壊れたフォントや読み取れないフォントが必ず存在します。

### 安全性

- **システム領域・マシン領域のフォントを削除してはなりません**。UI の無効化とは別に、Rust 側でも必ず拒否してください。
- インストール前にフォントファイルとしてパースできることを検証してください。

### コメント

- TypeScript と同じ方針です。原則として書かず、書く場合も 1 行以内にとどめてください。

## 配布

- `v`から始まるタグを push すると、GitHub Actions が macOS（universal）・Windows・Linux の配布物を作ってドラフトリリースを用意します。
- **署名と公証は行っていません**。macOS の利用者は初回起動時に Gatekeeper の回避が必要で、Windows では SmartScreen の警告が出ます。
- 自動アップデートは`tauri-plugin-updater`です。手順は[docs/updater.md](docs/updater.md)を参照してください。`TAURI_PRIVATE_KEY`が未設定のあいだは署名済み成果物が作られません。
- 署名を行う場合は[docs/code-signing.md](docs/code-signing.md)を参照してください。

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
- chore: 配布フローを Tauri ベースに移行
```

### PR

- `.github/PULL_REQUEST_TEMPLATE.md`を必ず使用してください。
- Draft で作成し、CI 通過後に Ready for Review に変更してください。
