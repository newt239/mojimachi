import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const textAtom = atom(
  "人類社会のすべての構成員の固有の尊厳と平等で譲ることのできない権利とを承認することは Whereas disregard and contempt for human rights have resulted"
);

export const pinnedFontsAtom = atomWithStorage<string[]>("pinned-fonts", []);

export const openedAtom = atom(true);
