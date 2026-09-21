import { useCallback, useEffect } from "react";

import { useAtom, useSetAtom } from "jotai";

import { resetFaces } from "~/lib/font-face-registry";
import { listFamilies, scanFonts } from "~/lib/ipc";

import { familiesAtom, isScanningAtom, scanErrorAtom, scanSummaryAtom } from "./atoms";

export const useCatalog = () => {
  const [families, setFamilies] = useAtom(familiesAtom);
  const [isScanning, setIsScanning] = useAtom(isScanningAtom);
  const [failure, setFailure] = useAtom(scanErrorAtom);
  const setSummary = useSetAtom(scanSummaryAtom);

  const reload = useCallback(
    async (force: boolean) => {
      setIsScanning(true);
      setFailure(null);
      if (force) {
        resetFaces();
      }
      const message = await scanFonts(force)
        .then(async (summary) => {
          setSummary(summary);
          setFamilies(await listFamilies());
          return null;
        })
        .catch((error: unknown) => (error instanceof Error ? error.message : String(error)));
      setFailure(message);
      setIsScanning(false);
    },
    [setFailure, setFamilies, setIsScanning, setSummary],
  );

  useEffect(() => {
    void reload(false);
  }, [reload]);

  return { families, isScanning, error: failure, reload };
};
