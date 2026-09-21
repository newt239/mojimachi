import { COMPARISON_LIMIT } from "./atoms";

import type { FamilySummary } from "~/lib/types";

export type ListFilter = {
  search: string;
  japaneseOnly: boolean;
  scope: string;
  favorites: string[];
  coverageNames: string[] | null;
  collectionMembers: string[] | null;
};

export const visibleFamilies = (families: FamilySummary[], filter: ListFilter) => {
  const keyword = filter.search.trim().toLowerCase();
  const favorites = new Set(filter.favorites);
  const covering = filter.coverageNames === null ? null : new Set(filter.coverageNames);
  const members = filter.collectionMembers === null ? null : new Set(filter.collectionMembers);

  return families.filter((family) => {
    if (keyword !== "" && !family.searchKey.includes(keyword)) {
      return false;
    }
    if (filter.japaneseOnly && !family.supportsJapanese) {
      return false;
    }
    if (covering !== null && !covering.has(family.name)) {
      return false;
    }
    if (filter.scope === "favorites" && !favorites.has(family.name)) {
      return false;
    }
    if (members !== null && !members.has(family.name)) {
      return false;
    }
    return true;
  });
};

// 空白と改行は無視し、重複を畳んでコードポイント順に並べる
export const normaliseQuery = (text: string) => {
  const chars = [...text].filter((ch) => !/\s/u.test(ch));
  return [...new Set(chars)].toSorted((a, b) => (a.codePointAt(0) ?? 0) - (b.codePointAt(0) ?? 0));
};

export const pruneSelection = (selection: string[], families: FamilySummary[]) => {
  const names = new Set(families.map((family) => family.name));
  return selection.filter((name) => names.has(name));
};

export const toggleSelection = (selection: string[], name: string) =>
  selection.includes(name) ? selection.filter((item) => item !== name) : [...selection, name];

export const comparisonTargets = (selection: string[]) =>
  selection.length < 2 ? [] : selection.slice(0, COMPARISON_LIMIT);

export const toggleFavorite = (favorites: string[], name: string) =>
  favorites.includes(name)
    ? favorites.filter((item) => item !== name)
    : [...favorites, name].toSorted((a, b) => a.localeCompare(b));

// 一部でも未登録があれば全部登録し、すべて登録済みなら全部外す
export const bulkFavorite = (favorites: string[], names: string[]) => {
  const current = new Set(favorites);
  const allFavorited = names.length > 0 && names.every((name) => current.has(name));
  for (const name of names) {
    if (allFavorited) {
      current.delete(name);
    } else {
      current.add(name);
    }
  }
  return [...current].toSorted((a, b) => a.localeCompare(b));
};
