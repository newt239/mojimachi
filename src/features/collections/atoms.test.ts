import { describe, expect, it } from "vitest";

import {
  addToCollection,
  collectionScopeId,
  removeFromCollection,
  scopeCollectionId,
  type Collection,
} from "./atoms";

const collections: Collection[] = [
  { id: "a", name: "本文用", familyNames: ["Beta"] },
  { id: "b", name: "見出し用", familyNames: [] },
];

describe("コレクション", () => {
  it("追加すると名前順に並び、重複しない", () => {
    const next = addToCollection(collections, "a", ["Alpha", "Beta"]);
    expect(next[0]?.familyNames).toEqual(["Alpha", "Beta"]);
  });

  it("別のコレクションには影響しない", () => {
    const next = addToCollection(collections, "a", ["Alpha"]);
    expect(next[1]?.familyNames).toEqual([]);
  });

  it("取り除くと残りだけになる", () => {
    const next = removeFromCollection(collections, "a", ["Beta"]);
    expect(next[0]?.familyNames).toEqual([]);
  });

  it("存在しない id を指定しても壊れない", () => {
    expect(addToCollection(collections, "zzz", ["Alpha"])).toEqual(collections);
  });

  it("スコープ ID と往復できる", () => {
    expect(scopeCollectionId(collectionScopeId("a"))).toBe("a");
    expect(scopeCollectionId("all")).toBeNull();
    expect(scopeCollectionId("favorites")).toBeNull();
  });
});
