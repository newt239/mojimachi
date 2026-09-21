# コード署名

現状、もじまちは **macOS・Windows とも署名していません**。利用者は初回起動時に OS の警告を回避する必要があります（手順は README を参照）。

署名を行う場合の手順をここにまとめます。

## macOS

`.github/workflows/build.yaml`は`APPLE_CERTIFICATE`が設定されているときだけ署名と公証を有効にします。未設定なら署名なしでビルドし、その旨を notice に出します。

必要な Secrets:

| Secret                       | 内容                                                          |
| ---------------------------- | ------------------------------------------------------------- |
| `APPLE_CERTIFICATE`          | Developer ID Application 証明書（`.p12`）を base64 にしたもの |
| `APPLE_CERTIFICATE_PASSWORD` | `.p12`のパスワード                                            |
| `APPLE_SIGNING_IDENTITY`     | `Developer ID Application: 名前 (TEAMID)`                     |
| `APPLE_ID`                   | Apple ID のメールアドレス                                     |
| `APPLE_PASSWORD`             | App 用パスワード（アプリ固有パスワード）                      |
| `APPLE_TEAM_ID`              | 10 文字のチーム ID                                            |

証明書を base64 にする:

```bash
base64 -i certificate.p12 | pbcopy
gh secret set APPLE_CERTIFICATE
```

Apple Developer Program（年間 99 USD）への登録が必要です。

## Windows

SmartScreen の警告を消すにはコード署名証明書が必要です。取得した場合は`tauri.conf.json`の`bundle.windows.certificateThumbprint`を設定するか、`tauri-action`に`WINDOWS_CERTIFICATE`と`WINDOWS_CERTIFICATE_PASSWORD`を渡します。

なお、新規に取得した証明書は SmartScreen の評価が貯まるまで警告が出続けます。EV 証明書なら即座に評価されます。

## Linux

AppImage と `.deb` に署名の仕組みはありません。`tauri-plugin-updater`の minisign 署名が改ざん検知を担います（[docs/updater.md](updater.md)）。
