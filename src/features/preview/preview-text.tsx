import { useEffect } from "react";

import { ensureFace, faceFamily } from "~/lib/font-face-registry";

import type { Orientation } from "~/features/fonts/atoms";

type Props = {
  faceId: string | undefined;
  text: string;
  size: number;
  orientation?: Orientation;
  variations?: Record<string, number>;
  features?: Record<string, number>;
  className?: string;
};

const settings = (values: Record<string, number> | undefined) => {
  const entries = Object.entries(values ?? {});
  return entries.length === 0
    ? undefined
    : entries.map(([tag, value]) => `"${tag}" ${value}`).join(", ");
};

export const PreviewText = ({
  faceId,
  text,
  size,
  orientation = "horizontal",
  variations,
  features,
  className,
}: Props) => {
  useEffect(() => {
    if (faceId !== undefined) {
      void ensureFace(faceId);
    }
  }, [faceId]);

  return (
    <span
      className={`mj-preview ${className ?? ""}`}
      style={{
        // 未収録文字は Tofu に落とす。合成ボールドは font-synthesis: none で抑止している
        ["--mj-face" as string]: faceId === undefined ? "inherit" : `"${faceFamily(faceId)}"`,
        fontSize: `${size}px`,
        lineHeight: 1.4,
        writingMode: orientation === "vertical" ? "vertical-rl" : "horizontal-tb",
        fontVariationSettings: settings(variations),
        fontFeatureSettings: settings(features),
      }}
    >
      {text}
    </span>
  );
};
