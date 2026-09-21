import type { FontFeature } from "~/lib/types";

export type FeatureToggle = {
  current: Record<string, number>;
  features: FontFeature[];
  tag: string;
  enabled: boolean;
};

// 排他グループ（jp78 / jp90 など）は同時に 1 つだけ有効にする
export const applyFeature = ({
  current,
  features,
  tag,
  enabled,
}: FeatureToggle): Record<string, number> => {
  const target = features.find((feature) => feature.tag === tag);
  const excluded = new Set(
    target?.group === null || target?.group === undefined
      ? [tag]
      : [tag, ...features.filter((item) => item.group === target.group).map((item) => item.tag)],
  );
  const kept = Object.entries(current).filter(([key]) => !excluded.has(key));
  return Object.fromEntries(enabled ? [...kept, [tag, 1]] : kept);
};
