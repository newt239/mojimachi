# もじまち

![app logo](public/mojimachi_banner.png)

macOS にインストールされたフォントを一覧し、掘り下げて見るためのアプリです。

## installation

[Releases](https://github.com/newt239/mojimachi/releases)ページから `mojimachi-x.y.z.dmg` をダウンロードし、`mojimachi.app` を `Applications` にドラッグしてください。

macOS 14 以降が必要です。universal binary なので Intel Mac と Apple Silicon Mac のどちらでも動きます。

Windows 版と Linux 版は提供していません。フォントの読み取りに macOS の CoreText を使っているためです。

### 「開発元を検証できないため開けません」と表示される場合

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

## development

### 前提

| ツール   | 備考                                        |
| -------- | ------------------------------------------- |
| Xcode    | swift-format と xcodebuild に使います       |
| XcodeGen | `brew install xcodegen`                      |

`.xcodeproj` はコミットしません。`apple/project.yml` から XcodeGen で生成します。

### setup

```bash
git clone https://github.com/newt239/mojimachi
cd mojimachi
make generate
```

### run

```bash
make run
```

### code check

```bash
make codecheck
```

lint（swift-format）・ビルド・テストをまとめて実行します。実装後は必ず通してください。

### コマンド一覧

| コマンド         | 内容                             |
| ---------------- | -------------------------------- |
| `make generate`  | Xcode プロジェクトを生成         |
| `make build`     | ビルド                           |
| `make run`       | ビルドして起動                   |
| `make test`      | テスト                           |
| `make format`    | swift-format で整形              |
| `make lint`      | swift-format で検査              |
| `make codecheck` | lint・ビルド・テストをまとめて   |

### release

`v` から始まるタグを push すると、GitHub Actions が `.dmg` を作ってドラフトリリースを用意します。

```bash
git tag v0.9.0
git push origin v0.9.0
```

自動アップデート（Sparkle）の有効化手順は[docs/sparkle.md](docs/sparkle.md)を参照してください。署名と公証を行う場合は[docs/macos-code-signing.md](docs/macos-code-signing.md)を参照してください。

## Recommended IDE Setup

- [Xcode](https://developer.apple.com/xcode/)
- [VS Code](https://code.visualstudio.com/) + [Swift](https://marketplace.visualstudio.com/items?itemName=swiftlang.swift-vscode)
