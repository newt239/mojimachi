import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { FontList } from "~/types/FontData";

export const fontListAtom = atom<FontList>([]);

export const fontNameListAtom = atom<string[]>([]);

export const textAtom = atomWithStorage(
  "sample-text",
  "Whereas disregard and contempt for human rights have resulted"
);

export const pinnedFontsAtom = atomWithStorage<string[]>("pinned-fonts", []);

export const fontSizeAtom = atomWithStorage("font-size", 16);
