# もじまち

![app logo](public/mojimachi_banner.png)

デバイス上にインストールされたフォントの一覧を表示します。

## installation

[Releases](https://github.com/newt239/mojimachi/releases)ページから最新のリリースを確認し、ご利用の環境に合ったインストーラをダウンロードしてください。

| OS                                 | ファイル                                                               |
| ---------------------------------- | ---------------------------------------------------------------------- |
| macOS (Intel / Apple Silicon 共通) | `mojimachi_x.y.z_universal.dmg`                                        |
| Windows                            | `mojimachi_x.y.z_x64-setup.exe` または `mojimachi_x.y.z_x64_en-US.msi` |
| Linux                              | `mojimachi_x.y.z_amd64.AppImage` または `mojimachi_x.y.z_amd64.deb`    |

macOS 版は universal binary です。Intel Mac と Apple Silicon Mac のどちらでも同じファイルが使えます。

### macOS で「開発元を検証できないため開けません」と表示される場合

現在このアプリは Apple Developer Program による署名と公証を行っていないため、ダウンロード後の初回起動時に macOS の Gatekeeper にブロックされます。以下のいずれかの方法で起動してください。

**方法 1: ターミナルで隔離属性を外す**

```
xattr -cr /Applications/mojimachi.app
```

**方法 2: システム設定から許可する**

1. `mojimachi.app` をダブルクリックする（ブロックされます）
2. 「システム設定」→「プライバシーとセキュリティ」を開く
3. 下部に表示される「"mojimachi" は開発元を確認できないため…」の横の「このまま開く」をクリックする

## development

### 前提

| ツール                   | 備考                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| Node.js                  | バージョンは `package.json` の `devEngines` で固定しています     |
| pnpm                     | バージョンは `package.json` の `packageManager` で固定しています |
| Rust                     | バージョンは `rust-toolchain.toml` で固定しています              |
| Xcode Command Line Tools | macOS のみ。`xcode-select --install`                             |

Linux でビルドする場合は追加のシステムパッケージが必要です。詳細は[Tauri のドキュメント](https://tauri.app/start/prerequisites/)を参照してください。

### setup

```
git clone https://github.com/newt239/mojimachi
cd mojimachi
pnpm install
```

### run

このアプリはデバイスにインストールされたフォントを読み取るため、ブラウザでは動作しません。必ず Tauri のウィンドウで起動してください。

```
pnpm tauri dev
```

### build

```
pnpm tauri build
```

macOS で universal binary を作る場合は次のとおりです。

```
rustup target add aarch64-apple-darwin x86_64-apple-darwin
pnpm tauri build --target universal-apple-darwin
```

### code check

```
pnpm run codecheck
pnpm run rust:check
```

`codecheck` は型チェック・Lint (oxlint)・フォーマット (oxfmt)・未使用コード検出 (knip) をまとめて実行します。`rust:check` は `cargo fmt` / `clippy` / `cargo test` を実行します。

### release

`v` から始まるタグを push すると、GitHub Actions が macOS / Windows / Linux のアーティファクトを生成してドラフトリリースを作成します。

```
git tag v0.8.0
git push origin v0.8.0
```

macOS の署名と公証の設定については[docs/macos-code-signing.md](docs/macos-code-signing.md)を参照してください。

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
