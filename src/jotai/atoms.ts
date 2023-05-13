import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { FontData } from "~/types/FontData";

export const fontListAtom = atom<FontData[]>([]);

export const fontNameListAtom = atom<string[]>([]);

export const textAtom = atom(
  "Whereas disregard and contempt for human rights have resulted"
);

export const pinnedFontsAtom = atomWithStorage<string[]>("pinned-fonts", []);
