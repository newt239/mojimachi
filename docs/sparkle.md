# Sparkle による自動アップデート

自動アップデートは [Sparkle](https://sparkle-project.org/) で行います。SwiftPM の依存として `apple/project.yml` に定義しています。

## 現状

**有効です。** 公開鍵は `apple/project.yml` の `SUPublicEDKey` に、秘密鍵は GitHub Secrets の `SPARKLE_PRIVATE_KEY` に登録済みです。タグを push すると appcast が生成され、アプリの「アップデートを確認…」メニューから更新できます。

`SUPublicEDKey` を空にすると自動アップデートは無効に戻ります。このときメニュー項目は表示されず、Sparkle の updater も起動しません。リリースワークフローも `SPARKLE_PRIVATE_KEY` が未設定なら appcast を生成せず、`.dmg` だけを添付します。

以下は鍵を作り直すときの手順です。**鍵を差し替えると、古い鍵で署名した更新は検証できなくなります。**

## 1. 鍵を生成する

Sparkle の配布物に含まれる `generate_keys` を使います。

```bash
curl -fsSLO https://github.com/sparkle-project/Sparkle/releases/download/2.6.4/Sparkle-2.6.4.tar.xz
mkdir -p sparkle && tar -xf Sparkle-2.6.4.tar.xz -C sparkle
./sparkle/bin/generate_keys
```

秘密鍵は macOS のキーチェーンに保存され、公開鍵が標準出力に表示されます。

## 2. 公開鍵と秘密鍵を登録する

**公開鍵**を `apple/project.yml` の `SUPublicEDKey` に書きます。

```yaml
SUPublicEDKey: "ここに公開鍵を貼る"
```

**秘密鍵**を GitHub の Secrets に `SPARKLE_PRIVATE_KEY` として登録します。秘密鍵は次のコマンドで取り出せます。

```bash
./sparkle/bin/generate_keys -x private-key.txt
```

取り出したファイルの中身をそのまま Secrets に貼り、ローカルのファイルは削除してください。

## 動作

タグを push すると、リリースワークフローが `.dmg` を作り、`generate_appcast` で `appcast.xml` を生成してリリースに添付します。アプリは `SUFeedURL` に設定した以下の URL を見にいきます。

```
https://github.com/newt239/mojimachi/releases/latest/download/appcast.xml
```

このアプリは署名・公証を行っていないため、Sparkle は Apple の署名ではなく **EdDSA 署名で更新の正当性を検証します**。秘密鍵が漏れると任意の更新を配信できてしまうので、Secrets 以外の場所に置かないでください。
