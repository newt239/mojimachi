# macOS のコード署名と公証

## 現状

**このリポジトリは現在、macOS 向けの署名と公証を行っていません。**

`.github/workflows/build.yaml` は `APPLE_CERTIFICATE` シークレットが設定されているかを確認し、設定されていない場合は署名なしでビルドします。そのため、署名を有効にするには Secrets を追加するだけで済み、ワークフローの変更は不要です。

署名なしで配布した `.app` は、ダウンロードした利用者の環境で Gatekeeper にブロックされます。利用者側の回避手順は README に記載しています。

## 署名を有効にする手順

### 1. Apple Developer Program に加入する

年間 99 USD です。個人の Apple ID で加入できます。

### 2. Developer ID Application 証明書を作成する

「Developer ID Application」は、App Store の外で配布するアプリに使う証明書です。Mac App Store 向けの「Mac App Distribution」ではないので注意してください。

1. [Apple Developer](https://developer.apple.com/account/resources/certificates/list) で「Developer ID Application」証明書を作成する
2. 作成した証明書をキーチェーンアクセスからダウンロードしてインストールする
3. キーチェーンアクセスで証明書と秘密鍵を選択し、`.p12` としてエクスポートする（このときパスワードを設定する）
4. base64 に変換する

```
base64 -i certificate.p12 | pbcopy
```

### 3. App-specific password を作成する

公証には Apple ID のパスワードではなく app-specific password を使います。

1. [appleid.apple.com](https://appleid.apple.com/) にサインインする
2. 「サインインとセキュリティ」→「App 用パスワード」から新規作成する

### 4. 署名 ID と Team ID を確認する

```
security find-identity -v -p codesigning
```

`Developer ID Application: 名前 (TEAMID)` の形式で表示されます。この文字列全体が `APPLE_SIGNING_IDENTITY`、括弧内が `APPLE_TEAM_ID` です。

### 5. GitHub Secrets を登録する

リポジトリの Settings → Secrets and variables → Actions に以下を登録します。

| Secret                       | 内容                                      |
| ---------------------------- | ----------------------------------------- |
| `APPLE_CERTIFICATE`          | `.p12` を base64 エンコードした文字列     |
| `APPLE_CERTIFICATE_PASSWORD` | `.p12` エクスポート時に設定したパスワード |
| `APPLE_SIGNING_IDENTITY`     | `Developer ID Application: 名前 (TEAMID)` |
| `APPLE_ID`                   | Apple ID のメールアドレス                 |
| `APPLE_PASSWORD`             | App-specific password                     |
| `APPLE_TEAM_ID`              | Team ID                                   |

`APPLE_CERTIFICATE` を登録した時点で、次回のリリースから署名・公証・staple が自動で実行されます。

## アップデータの署名鍵

Apple の署名とは別に、Tauri のアップデータ用の署名鍵があります。これは既に設定済みです。

| Secret               | 内容               |
| -------------------- | ------------------ |
| `TAURI_PRIVATE_KEY`  | minisign の秘密鍵  |
| `TAURI_KEY_PASSWORD` | 秘密鍵のパスワード |

公開鍵は `src-tauri/tauri.conf.json` の `plugins.updater.pubkey` に入っています。

Tauri v2 では環境変数名が `TAURI_SIGNING_PRIVATE_KEY` / `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` に変わっていますが、Secrets 名は v1 のときのまま流用し、ワークフロー側で読み替えています。

## 確認方法

リリース後、生成された `.dmg` に対して以下を実行します。

```
spctl -a -vvv -t install mojimachi.app
codesign -dv --verbose=4 mojimachi.app
xcrun stapler validate mojimachi.app
```

`spctl` が `accepted` かつ `source=Notarized Developer ID` を返せば成功です。
