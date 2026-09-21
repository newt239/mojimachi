import { useCallback, useEffect, useState } from "react";

import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from "@tauri-apps/plugin-dialog";

import { installFonts } from "~/lib/ipc";

import type { InstallReport } from "~/lib/types";

const EXTENSIONS = ["ttf", "otf", "ttc", "otc"];

const isFontPath = (path: string) =>
  EXTENSIONS.some((extension) => path.toLowerCase().endsWith(`.${extension}`));

export const useInstall = (onInstalled: () => void) => {
  const [report, setReport] = useState<InstallReport | null>(null);
  const [dropping, setDropping] = useState(false);

  const install = useCallback(
    async (paths: string[]) => {
      const fonts = paths.filter((path) => isFontPath(path));
      if (fonts.length === 0) {
        return;
      }
      setReport(await installFonts(fonts));
      onInstalled();
    },
    [onInstalled],
  );

  const pick = useCallback(async () => {
    const picked = await open({
      multiple: true,
      filters: [{ name: "フォント", extensions: EXTENSIONS }],
    });
    if (Array.isArray(picked)) {
      await install(picked);
    }
  }, [install]);

  useEffect(() => {
    let lastDrop = 0;
    const unlisten = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "over") {
        setDropping(true);
        return;
      }
      if (event.payload.type === "leave") {
        setDropping(false);
        return;
      }
      setDropping(false);
      // 同じ操作で 2 回発火することがあるため間隔で弾く（tauri#14134）
      const now = Date.now();
      if (now - lastDrop < 500) {
        return;
      }
      lastDrop = now;
      void install(event.payload.paths);
    });
    return () => {
      void unlisten.then((stop) => stop());
    };
  }, [install]);

  return { report, dropping, pick, dismiss: () => setReport(null) };
};
