import { useCallback, useState } from "react";

import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";

export type UpdateState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "none" }
  | { kind: "downloading"; version: string }
  | { kind: "ready"; version: string }
  | { kind: "failed"; message: string };

export const useUpdater = () => {
  const [state, setState] = useState<UpdateState>({ kind: "idle" });

  const checkForUpdate = useCallback(async () => {
    setState({ kind: "checking" });
    try {
      const update = await check();
      if (update === null) {
        setState({ kind: "none" });
        return;
      }
      setState({ kind: "downloading", version: update.version });
      await update.downloadAndInstall();
      setState({ kind: "ready", version: update.version });
    } catch (error) {
      setState({ kind: "failed", message: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  return { state, checkForUpdate, restart: relaunch, dismiss: () => setState({ kind: "idle" }) };
};
