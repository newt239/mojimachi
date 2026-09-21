import { describe, expect, it } from "vitest";

import { applyFeature } from "./apply-feature";

import type { FontFeature } from "~/lib/types";

const feature = (tag: string, group: string | null): FontFeature => ({
  tag,
  label: tag,
  group,
  sample: "辻",
});

const features = [
  feature("jp78", "字形"),
  feature("jp90", "字形"),
  feature("palt", null),
  feature("liga", null),
];

describe("OpenType 機能の切り替え", () => {
  it("有効にするとタグが 1 で入る", () => {
    expect(applyFeature({ current: {}, features, tag: "palt", enabled: true })).toEqual({
      palt: 1,
    });
  });

  it("無効にするとタグが外れる", () => {
    expect(applyFeature({ current: { palt: 1 }, features, tag: "palt", enabled: false })).toEqual(
      {},
    );
  });

  it("同じ排他グループの機能は同時に有効にならない", () => {
    const next = applyFeature({ current: { jp78: 1 }, features, tag: "jp90", enabled: true });
    expect(next).toEqual({ jp90: 1 });
  });

  it("グループのない機能は共存できる", () => {
    const next = applyFeature({ current: { palt: 1 }, features, tag: "liga", enabled: true });
    expect(next).toEqual({ palt: 1, liga: 1 });
  });

  it("排他グループの機能を切ってもグループ外は残る", () => {
    const next = applyFeature({
      current: { jp78: 1, palt: 1 },
      features,
      tag: "jp78",
      enabled: false,
    });
    expect(next).toEqual({ palt: 1 });
  });

  it("未知のタグはそのまま追加される", () => {
    expect(applyFeature({ current: {}, features, tag: "zzzz", enabled: true })).toEqual({
      zzzz: 1,
    });
  });
});
