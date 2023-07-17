import { atom } from "jotai";

export const familyKeywordAtom = atom<string>("");

export const jaFilterAtom = atom<boolean>(false);

export const previewStringAtom = atom<string>("日本語どう？");

export const favoriteFamiliesAtom = atom<string[]>([]);
