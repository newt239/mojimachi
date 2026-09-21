import { atom } from "jotai";

export type Route =
  | { name: "list" }
  | { name: "detail"; familyName: string }
  | { name: "compare"; familyNames: string[] };

export const routeAtom = atom<Route>({ name: "list" });
