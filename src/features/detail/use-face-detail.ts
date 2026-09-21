import { useEffect, useState } from "react";

import { getFaceBlocks, getFaceCoverage, getFaceDetail } from "~/lib/ipc";

import type { BlockGlyphs, CharsetCoverage, FaceDetail } from "~/lib/types";

export const useFaceDetail = (faceId: string | undefined) => {
  const [detail, setDetail] = useState<FaceDetail | null>(null);
  const [coverage, setCoverage] = useState<CharsetCoverage[]>([]);
  const [blocks, setBlocks] = useState<BlockGlyphs[]>([]);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (faceId === undefined) {
      return;
    }
    let active = true;
    void Promise.all([getFaceDetail(faceId), getFaceCoverage(faceId), getFaceBlocks(faceId)])
      .then(([nextDetail, nextCoverage, nextBlocks]) => {
        if (!active) {
          return;
        }
        setDetail(nextDetail);
        setCoverage(nextCoverage);
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

  return { detail, coverage, blocks, error: failure };
};
