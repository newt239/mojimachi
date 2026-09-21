import type { FamilySummary, StyleSummary } from "~/lib/types";

export const WEIGHTS = [
  { id: "thin", label: "極細", value: 100 },
  { id: "light", label: "細字", value: 300 },
  { id: "regular", label: "標準", value: 400 },
  { id: "medium", label: "中字", value: 500 },
  { id: "bold", label: "太字", value: 700 },
  { id: "black", label: "極太", value: 900 },
] as const;

export type WeightId = (typeof WEIGHTS)[number]["id"];

export const WEIGHT_IDS = WEIGHTS.map((weight) => weight.id);

export const weightValue = (id: WeightId) =>
  WEIGHTS.find((weight) => weight.id === id)?.value ?? 400;

// 要求したウエイトに最も近い実在スタイルを選ぶ。合成ボールドは使わない
export const nearestStyle = (
  family: FamilySummary,
  weight: WeightId,
  italic: boolean,
): StyleSummary | undefined => {
  const preferred = family.styles.filter((style) => style.isItalic === italic);
  const candidates = preferred.length > 0 ? preferred : family.styles;
  const target = weightValue(weight);

  const sorted = candidates.toSorted((a, b) => {
    const gap = Math.abs(a.weight - target) - Math.abs(b.weight - target);
    return gap === 0 ? a.weight - b.weight : gap;
  });
  return sorted[0];
};

export const representativeStyle = (family: FamilySummary) =>
  nearestStyle(family, "regular", false);
