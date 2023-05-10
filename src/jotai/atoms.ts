import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FontData } from "~/types/FontData";

export const fontListAtom = atom<FontData[]>([]);

export const fontNameListAtom = atom<string[]>([]);

export const textAtom = atom(
  "人類社会のすべての構成員の固有の尊厳と平等で譲ることのできない権利とを承認することは Whereas disregard and contempt for human rights have resulted"
);

export const pinnedFontsAtom = atomWithStorage<string[]>("pinned-fonts", []);

export const openedAtom = atom(true);
