# もじまち

![app logo](public/mojimachi_banner.png)

デバイス上にインストールされたフォントの一覧を表示します。

## installation

[Releases](https://github.com/newt239/mojimachi/releases)ページから最新のリリースを確認し、ご利用の環境に合ったインストーラをダウンロードしてください。

- Windows: `mojimachi-setup-x.x.x.exe`
- macOS: `mojimachi_x.y.z_x64_en-US.msi`
- Linux: `mojimachi_x.y.z_amd64.AppImage`

## development

### setup

```
git clone https://github.com/newt239/mojimachi
cd mojimachi
pnpm install
```

### run

```
pnpm tauri dev
```

### build

```
pnpm tauri build
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
