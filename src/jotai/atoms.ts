import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const textAtom = atom("hello world");

export const pinnedFontsAtom = atomWithStorage<string[]>("pinned-fonts", []);
