import { describe, expect, it } from "vitest";

import {
  catalogRowsPerPage,
  chunk,
  estimatePageCount,
  gridCapacity,
  waterfallFamiliesPerPage,
  WATERFALL_SIZES,
} from "./layout";

describe("ページ分割", () => {
  it("要素を失わずに分割する", () => {
    const items = [1, 2, 3, 4, 5];
    const pages = chunk(items, 2);
    expect(pages).toEqual([[1, 2], [3, 4], [5]]);
    expect(pages.flat()).toEqual(items);
  });

  it("空の入力では 0 ページになる", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it("容量が 0 でも落ちない", () => {
    expect(chunk([1, 2], 0)).toEqual([[1, 2]]);
    expect(chunk([], 0)).toEqual([]);
  });
});

describe("レイアウトの容量計算", () => {
  it("カタログは 1 ページに 1 行以上入る", () => {
    expect(catalogRowsPerPage(18)).toBeGreaterThan(0);
    expect(catalogRowsPerPage(72)).toBeGreaterThan(0);
  });

  it("サンプルが大きいほど 1 ページの行数は減る", () => {
    expect(catalogRowsPerPage(72)).toBeLessThanOrEqual(catalogRowsPerPage(18));
  });

  it("サイズ 0 でもゼロ除算にならない", () => {
    expect(catalogRowsPerPage(0)).toBe(0);
    expect(gridCapacity(0)).toEqual({ columns: 0, rows: 0, total: 0 });
  });

  it("格子の容量は列数×行数になる", () => {
    const capacity = gridCapacity(24);
    expect(capacity.total).toBe(capacity.columns * capacity.rows);
    expect(capacity.total).toBeGreaterThan(0);
  });

  it("ウォーターフォールは 1 ページに 1 書体以上入る", () => {
    expect(waterfallFamiliesPerPage()).toBeGreaterThan(0);
  });

  it("ウォーターフォールのサイズ段階は 12 段で昇順かつ一意", () => {
    expect(WATERFALL_SIZES).toHaveLength(12);
    expect(WATERFALL_SIZES).toEqual([...WATERFALL_SIZES].toSorted((a, b) => a - b));
    expect(new Set(WATERFALL_SIZES).size).toBe(12);
  });
});

describe("概算ページ数", () => {
  it("対象がなければ 0 ページ", () => {
    expect(
      estimatePageCount({ style: "catalog", familyNames: [], sampleSize: 18, glyphCount: 0 }),
    ).toBe(0);
  });

  it("カタログは書体数を行数で割ったページ数になる", () => {
    const names = Array.from({ length: 100 }, (_, index) => `Font ${index}`);
    const expected = Math.ceil(names.length / catalogRowsPerPage(18));
    expect(
      estimatePageCount({ style: "catalog", familyNames: names, sampleSize: 18, glyphCount: 0 }),
    ).toBe(expected);
  });

  it("レパートリーは書体ごとにグリフ数ぶんのページを使う", () => {
    const capacity = gridCapacity(24).total;
    const pages = estimatePageCount({
      style: "repertoire",
      familyNames: ["A", "B"],
      sampleSize: 24,
      glyphCount: capacity * 3,
    });
    expect(pages).toBe(6);
  });

  it("グリフが少なくても書体あたり 1 ページは使う", () => {
    expect(
      estimatePageCount({
        style: "repertoire",
        familyNames: ["A"],
        sampleSize: 24,
        glyphCount: 1,
      }),
    ).toBe(1);
  });
});
