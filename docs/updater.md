# 自動アップデート

もじまちは[tauri-plugin-updater](https://v2.tauri.app/plugin/updater/)で自動アップデートを行います。GitHub Releases に置いた`latest.json`を見に行き、minisign の署名を検証してから適用します。

## 仕組み

1. タグ `v*` を push すると`.github/workflows/build.yaml`が 3 OS の配布物を作る
2. `TAURI_PRIVATE_KEY`が設定されていれば、成果物に minisign の署名が付き`latest.json`が生成される
3. アプリは`src-tauri/tauri.conf.json`の`plugins.updater.endpoints`を見に行き、`pubkey`で署名を検証する
4. メニューの「アップデートを確認…」から手動で確認できる

## 鍵の設定

`pubkey`に対応する秘密鍵が GitHub Secrets の`TAURI_PRIVATE_KEY`に入っている必要があります。**鍵を失うと既存ユーザーへアップデートを配れなくなります**。

### 鍵が残っているか確認する

```bash
gh secret list
```

`TAURI_PRIVATE_KEY`と`TAURI_KEY_PASSWORD`が並んでいれば、そのまま使えます。

### 鍵を作り直す

鍵を失っている場合は作り直します。**作り直すと、それまでのバージョンからは自動アップデートできなくなります**。

```bash
pnpm tauri signer generate -w ~/.tauri/mojimachi.key
```

1. 出力された公開鍵を`src-tauri/tauri.conf.json`の`plugins.updater.pubkey`に貼る
2. 秘密鍵（`~/.tauri/mojimachi.key`の中身）を`TAURI_PRIVATE_KEY`に登録する
3. 設定したパスワードを`TAURI_KEY_PASSWORD`に登録する

```bash
gh secret set TAURI_PRIVATE_KEY < ~/.tauri/mojimachi.key
gh secret set TAURI_KEY_PASSWORD
```

## 未設定のあいだの挙動

`TAURI_PRIVATE_KEY`が空のままでも配布物のビルドは通りますが、署名済み成果物と`latest.json`が作られないため、アプリ側のアップデート確認は「最新版を使っています」と表示されます。利用者は Releases から手動で入れ直す必要があります。
