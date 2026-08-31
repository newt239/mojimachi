import { ask } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";

export const checkForUpdate = async () => {
  const update = await check();

  if (!update) {
    return;
  }

  const shouldUpdate = await ask(`もじまち ${update.version} が利用できます。今すぐ更新しますか?`, {
    cancelLabel: "あとで",
    kind: "info",
    okLabel: "更新する",
    title: "アップデート",
  });

  if (!shouldUpdate) {
    return;
  }

  await update.downloadAndInstall();
  await relaunch();
};
