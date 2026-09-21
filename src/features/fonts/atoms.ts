import { atom } from "jotai";

import {
  isBoolean,
  isNumber,
  isString,
  isStringArray,
  LIBRARY,
  oneOf,
  persistentAtom,
  SETTINGS,
} from "~/lib/store";

import { WEIGHT_IDS, type WeightId } from "./weight";

import type { CoverageFilter, FamilySummary, ScanSummary } from "~/lib/types";

export const PRESET_TEXTS = [
  "あのイーハトーヴォのすきとおった風",
  "いろはにほへとちりぬるを わかよたれそ",
  "永東国酬鷹霊鬱纖鬮",
  "The quick brown fox jumps over the lazy dog",
  "0123456789 ABCDEFG abcdefg",
];

export const ORIENTATIONS = ["horizontal", "vertical"] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export const COMPARISON_MODES = ["stacked", "onion"] as const;
export type ComparisonMode = (typeof COMPARISON_MODES)[number];

export const DETAIL_TABS = ["info", "glyphs", "sample"] as const;
export type DetailTab = (typeof DETAIL_TABS)[number];

export const PRINT_STYLES = ["catalog", "repertoire", "waterfall"] as const;
export type PrintStyle = (typeof PRINT_STYLES)[number];

export const COMPARISON_LIMIT = 4;

export const familiesAtom = atom<FamilySummary[]>([]);
export const scanSummaryAtom = atom<ScanSummary | null>(null);
export const scanErrorAtom = atom<string | null>(null);
export const isScanningAtom = atom(false);

export const searchAtom = atom("");
export const scopeAtom = atom<string>("all");
export const selectionAtom = atom<string[]>([]);
export const coverageResultAtom = atom<CoverageFilter | null>(null);

export const favoritesAtom = persistentAtom<string[]>({
  file: LIBRARY,
  key: "favorites",
  initial: [],
  guard: isStringArray,
});
export const previewTextAtom = persistentAtom({
  file: SETTINGS,
  key: "previewText",
  initial: PRESET_TEXTS[0] ?? "",
  guard: isString,
});
export const fontSizeAtom = persistentAtom({
  file: SETTINGS,
  key: "fontSize",
  initial: 28,
  guard: isNumber,
});
export const weightAtom = persistentAtom<WeightId>({
  file: SETTINGS,
  key: "weight",
  initial: "regular",
  guard: oneOf(WEIGHT_IDS),
});
export const isItalicAtom = persistentAtom({
  file: SETTINGS,
  key: "isItalic",
  initial: false,
  guard: isBoolean,
});
export const japaneseOnlyAtom = persistentAtom({
  file: SETTINGS,
  key: "japaneseOnly",
  initial: false,
  guard: isBoolean,
});
export const orientationAtom = persistentAtom<Orientation>({
  file: SETTINGS,
  key: "orientation",
  initial: "horizontal",
  guard: oneOf(ORIENTATIONS),
});
export const showsSystemDuplicatesAtom = persistentAtom({
  file: SETTINGS,
  key: "showsSystemDuplicates",
  initial: false,
  guard: isBoolean,
});
export const coverageQueryAtom = persistentAtom({
  file: SETTINGS,
  key: "coverageQuery",
  initial: "",
  guard: isString,
});
export const comparisonModeAtom = persistentAtom<ComparisonMode>({
  file: SETTINGS,
  key: "comparisonMode",
  initial: "stacked",
  guard: oneOf(COMPARISON_MODES),
});

export const detailTabAtom = persistentAtom<DetailTab>({
  file: SETTINGS,
  key: "detailTab",
  initial: "info",
  guard: oneOf(DETAIL_TABS),
});
export const detailSampleTextAtom = persistentAtom({
  file: SETTINGS,
  key: "detailSampleText",
  initial:
    "あのイーハトーヴォのすきとおった風、\n夏でも底に冷たさをもつ青いそら、\nうつくしい森で飾られたモリーオ市。",
  guard: isString,
});
export const detailSampleSizeAtom = persistentAtom({
  file: SETTINGS,
  key: "detailSampleSize",
  initial: 36,
  guard: isNumber,
});
export const detailLineSpacingAtom = persistentAtom({
  file: SETTINGS,
  key: "detailLineSpacing",
  initial: 8,
  guard: isNumber,
});
export const detailForegroundAtom = persistentAtom({
  file: SETTINGS,
  key: "detailForeground",
  initial: "#000000",
  guard: isString,
});
export const detailBackgroundAtom = persistentAtom({
  file: SETTINGS,
  key: "detailBackground",
  initial: "#ffffff",
  guard: isString,
});

export const printStyleAtom = persistentAtom<PrintStyle>({
  file: SETTINGS,
  key: "printStyle",
  initial: "catalog",
  guard: oneOf(PRINT_STYLES),
});
export const printSampleTextAtom = persistentAtom({
  file: SETTINGS,
  key: "printSampleText",
  initial: PRESET_TEXTS[0] ?? "",
  guard: isString,
});
export const printSampleSizeAtom = persistentAtom({
  file: SETTINGS,
  key: "printSampleSize",
  initial: 18,
  guard: isNumber,
});
