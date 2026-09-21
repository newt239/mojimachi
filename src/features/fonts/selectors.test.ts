import { describe, expect, it } from "vitest";

import {
  bulkFavorite,
  comparisonTargets,
  normaliseQuery,
  pruneSelection,
  toggleFavorite,
  toggleSelection,
  visibleFamilies,
  type ListFilter,
} from "./selectors";

import type { FamilySummary } from "~/lib/types";

const family = (name: string, japanese = false): FamilySummary => ({
  name,
  searchKey: name.toLowerCase(),
  supportsJapanese: japanese,
  hasItalic: false,
  styles: [],
});

const baseFilter: ListFilter = {
  search: "",
  japaneseOnly: false,
  scope: "all",
  favorites: [],
  coverageNames: null,
  collectionMembers: null,
};

const families = [family("Helvetica"), family("ヒラギノ角ゴシック", true), family("Menlo")];

describe("一覧の絞り込み", () => {
  it("検索は大文字小文字を無視した部分一致になる", () => {
    const result = visibleFamilies(families, { ...baseFilter, search: "MENL" });
    expect(result.map((item) => item.name)).toEqual(["Menlo"]);
  });

  it("空の検索語では絞り込まない", () => {
    expect(visibleFamilies(families, { ...baseFilter, search: "   " })).toHaveLength(3);
  });

  it("日本語のみでは日本語対応だけが残る", () => {
    const result = visibleFamilies(families, { ...baseFilter, japaneseOnly: true });
    expect(result.map((item) => item.name)).toEqual(["ヒラギノ角ゴシック"]);
  });

  it("お気に入りスコープではお気に入りだけが残る", () => {
    const result = visibleFamilies(families, {
      ...baseFilter,
      scope: "favorites",
      favorites: ["Menlo"],
    });
    expect(result.map((item) => item.name)).toEqual(["Menlo"]);
  });

  it("収録文字の絞り込みと検索を同時に適用する", () => {
    const result = visibleFamilies(families, {
      ...baseFilter,
      search: "e",
      coverageNames: ["Menlo", "ヒラギノ角ゴシック"],
    });
    expect(result.map((item) => item.name)).toEqual(["Menlo"]);
  });

  it("コレクションの所属で絞り込む", () => {
    const result = visibleFamilies(families, {
      ...baseFilter,
      collectionMembers: ["Helvetica"],
    });
    expect(result.map((item) => item.name)).toEqual(["Helvetica"]);
  });
});

describe("収録文字クエリの正規化", () => {
  it("空白と改行を無視して重複を畳む", () => {
    expect(normaliseQuery(" a b\na ")).toEqual(["a", "b"]);
  });

  it("コードポイント順に並べる", () => {
    expect(normaliseQuery("бAあ")).toEqual(["A", "б", "あ"]);
  });

  it("サロゲートペアを 1 文字として扱う", () => {
    expect(normaliseQuery("𠮟𠮟")).toEqual(["𠮟"]);
  });

  it("空文字では何も返さない", () => {
    expect(normaliseQuery("   ")).toEqual([]);
  });
});

describe("選択と比較", () => {
  it("一覧から消えたファミリーは選択から外す", () => {
    expect(pruneSelection(["Menlo", "Gone"], families)).toEqual(["Menlo"]);
  });

  it("選択はトグルできる", () => {
    expect(toggleSelection(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleSelection(["a", "b"], "a")).toEqual(["b"]);
  });

  it("比較は 2 書体以上で成立し、最大 4 書体になる", () => {
    expect(comparisonTargets(["a"])).toEqual([]);
    expect(comparisonTargets(["a", "b"])).toEqual(["a", "b"]);
    expect(comparisonTargets(["a", "b", "c", "d", "e"])).toEqual(["a", "b", "c", "d"]);
  });
});

describe("お気に入り", () => {
  it("追加すると名前順に並ぶ", () => {
    expect(toggleFavorite(["b"], "a")).toEqual(["a", "b"]);
    expect(toggleFavorite(["a", "b"], "a")).toEqual(["b"]);
  });

  it("一部が未登録ならまとめて登録する", () => {
    expect(bulkFavorite(["a"], ["a", "b"])).toEqual(["a", "b"]);
  });

  it("すべて登録済みならまとめて解除する", () => {
    expect(bulkFavorite(["a", "b", "c"], ["a", "b"])).toEqual(["c"]);
  });

  it("空の選択では何も変わらない", () => {
    expect(bulkFavorite(["a"], [])).toEqual(["a"]);
  });
});
