import { atom } from "jotai";

import { FontInfo } from "~/types/FontData";

export const familyListAtom = atom<FontInfo[] | null>(null);

export const familyKeywordAtom = atom<string>("");

export const jaFilterAtom = atom<boolean>(false);

export const previewStringAtom = atom<string>(
  "The quick brown fox jumps over the lazy dog."
);

export const favoriteFamiliesAtom = atom<string[]>([]);

export const displayModeAtom = atom<"normal" | "vertical">("normal");
