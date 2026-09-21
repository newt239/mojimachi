import { describe, expect, it } from "vitest";

import { nearestStyle, WEIGHTS, weightValue } from "./weight";

import type { FamilySummary, StyleSummary } from "~/lib/types";

const style = (name: string, weight: number, isItalic: boolean): StyleSummary => ({
  faceId: `${name}-${weight}-${isItalic ? "i" : "r"}`,
  styleName: name,
  postscriptName: name,
  weight,
  width: 5,
  isItalic,
  isMonospaced: false,
  isVariable: false,
  source: "user",
  sourceLabel: "ユーザー",
  formatLabel: "TrueType",
  canExport: true,
  canUninstall: true,
});

const family = (styles: StyleSummary[]): FamilySummary => ({
  name: "Sample",
  searchKey: "sample",
  supportsJapanese: false,
  hasItalic: styles.some((item) => item.isItalic),
  styles,
});

describe("ウエイトの最近傍解決", () => {
  it("要求したウエイトに最も近いスタイルを選ぶ", () => {
    const target = family([
      style("Light", 300, false),
      style("Regular", 400, false),
      style("Bold", 700, false),
    ]);
    expect(nearestStyle(target, "medium", false)?.styleName).toBe("Regular");
    expect(nearestStyle(target, "black", false)?.styleName).toBe("Bold");
    expect(nearestStyle(target, "thin", false)?.styleName).toBe("Light");
  });

  it("同じ差なら細いほうを選ぶ", () => {
    const target = family([style("Light", 300, false), style("Bold", 700, false)]);
    expect(nearestStyle(target, "regular", false)?.styleName).toBe("Light");
  });

  it("斜体を要求して斜体がなければローマン体に落とす", () => {
    const target = family([style("Regular", 400, false)]);
    expect(nearestStyle(target, "regular", true)?.styleName).toBe("Regular");
  });

  it("斜体があれば斜体のなかから選ぶ", () => {
    const target = family([
      style("Regular", 400, false),
      style("Bold", 700, false),
      style("Italic", 400, true),
    ]);
    expect(nearestStyle(target, "bold", true)?.styleName).toBe("Italic");
  });

  it("スタイルが無ければ選べない", () => {
    expect(nearestStyle(family([]), "regular", false)).toBeUndefined();
  });

  it("ウエイトは 6 段で昇順かつ一意", () => {
    const values = WEIGHTS.map((weight) => weight.value);
    expect(values).toEqual([100, 300, 400, 500, 700, 900]);
    expect(new Set(WEIGHTS.map((weight) => weight.id)).size).toBe(6);
    expect(weightValue("regular")).toBe(400);
  });
});
