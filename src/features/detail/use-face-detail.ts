import { useEffect, useState } from "react";

import { getFaceBlocks, getFaceDetail } from "~/lib/ipc";

import type { BlockGlyphs, FaceDetail } from "~/lib/types";

export const useFaceDetail = (faceId: string | undefined) => {
  const [detail, setDetail] = useState<FaceDetail | null>(null);
  const [blocks, setBlocks] = useState<BlockGlyphs[]>([]);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (faceId === undefined) {
      return;
    }
    let active = true;
    void Promise.all([getFaceDetail(faceId), getFaceBlocks(faceId)])
      .then(([nextDetail, nextBlocks]) => {
        if (!active) {
          return;
        }
        setDetail(nextDetail);
        setBlocks(nextBlocks);
        setFailure(null);
      })
      .catch((error: unknown) => {
        if (active) {
          setFailure(error instanceof Error ? error.message : String(error));
        }
      });
    return () => {
      active = false;
    };
  }, [faceId]);

  return { detail, blocks, error: failure };
};
