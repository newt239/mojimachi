# もじまち

![app logo](public/mojimachi_banner.png)

インストールされたフォントを一覧し、掘り下げて見るためのアプリです。macOS・Windows・Linux で動きます。

## installation

[Releases](https://github.com/newt239/mojimachi/releases)ページから、お使いの OS 向けのファイルをダウンロードしてください。

| OS      | ファイル                         |
| ------- | -------------------------------- |
| macOS   | `mojimachi_x.y.z_universal.dmg`  |
| Windows | `mojimachi_x.y.z_x64-setup.exe`  |
| Linux   | `mojimachi_x.y.z_amd64.AppImage` |

macOS 版は universal binary なので Intel Mac と Apple Silicon Mac のどちらでも動きます。

### macOS で「開発元を検証できないため開けません」と表示される場合

このアプリは Apple Developer Program による署名と公証を行っていないため、初回起動時に Gatekeeper にブロックされます。以下のいずれかで起動してください。

**方法 1: Finder から開く**

`mojimachi.app` を右クリックして「開く」を選び、確認ダイアログで「開く」をクリックします。

**方法 2: ターミナルで隔離属性を外す**

```bash
xattr -cr /Applications/mojimachi.app
```

**方法 3: システム設定から許可する**

1. `mojimachi.app` をダブルクリックする（ブロックされます）
2. 「システム設定」→「プライバシーとセキュリティ」を開く
3. 下部の「"mojimachi" は開発元を確認できないため…」の横の「このまま開く」をクリックする

### Windows で SmartScreen の警告が出る場合

コード署名を行っていないため「WindowsによってPCが保護されました」と表示されます。「詳細情報」→「実行」をクリックしてください。

## development

### 前提

| ツール  | 備考                                  |
| ------- | ------------------------------------- |
| Node.js | 24 以上                               |
| pnpm    | `corepack enable pnpm`                |
| Rust    | stable（`rust-toolchain.toml`で指定） |

Linux では追加で以下が必要です。

```bash
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf libfontconfig1-dev
```

### setup

```bash
git clone https://github.com/newt239/mojimachi
cd mojimachi
pnpm install
```

### run

```bash
pnpm dev
```

### code check

```bash
pnpm codecheck
```

lint（oxlint・oxfmt・型検査）・テスト（Vitest・cargo test）・clippy をまとめて実行します。実装後は必ず通してください。

### コマンド一覧

| コマンド          | 内容                   |
| ----------------- | ---------------------- |
| `pnpm dev`        | 開発モードで起動       |
| `pnpm build`      | 配布物をビルド         |
| `pnpm lint`       | oxlint・oxfmt・型検査  |
| `pnpm format`     | oxfmt で整形           |
| `pnpm test`       | Vitest                 |
| `pnpm cargo:lint` | rustfmt・clippy        |
| `pnpm cargo:test` | cargo test             |
| `pnpm codecheck`  | lint・テストをまとめて |

### release

`v` から始まるタグを push すると、GitHub Actions が 3 OS の配布物を作ってドラフトリリースを用意します。

```bash
git tag v2.0.0
git push origin v2.0.0
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
