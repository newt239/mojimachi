import { atom } from "jotai";

export const familyKeywordAtom = atom<string>("");

export const jaFilterAtom = atom<boolean>(false);

export const previewStringAtom = atom<string>(
  "The quick brown fox jumps over the lazy dog."
);

export const favoriteFamiliesAtom = atom<string[]>([]);
