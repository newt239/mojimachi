import { LIBRARY, persistentAtom } from "~/lib/store";

export type Collection = {
  id: string;
  name: string;
  familyNames: string[];
};

const isCollection = (value: unknown): value is Collection =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  "name" in value &&
  "familyNames" in value &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  Array.isArray(value.familyNames) &&
  value.familyNames.every((item) => typeof item === "string");

const isCollectionArray = (value: unknown): value is Collection[] =>
  Array.isArray(value) && value.every((item) => isCollection(item));

export const collectionsAtom = persistentAtom<Collection[]>({
  file: LIBRARY,
  key: "collections",
  initial: [],
  guard: isCollectionArray,
});

export const SCOPE_PREFIX = "collection:";

export const collectionScopeId = (id: string) => `${SCOPE_PREFIX}${id}`;

export const scopeCollectionId = (scope: string) =>
  scope.startsWith(SCOPE_PREFIX) ? scope.slice(SCOPE_PREFIX.length) : null;

export const addToCollection = (
  collections: Collection[],
  id: string,
  familyNames: string[],
): Collection[] =>
  collections.map((collection) =>
    collection.id === id
      ? {
          ...collection,
          familyNames: [...new Set([...collection.familyNames, ...familyNames])].toSorted((a, b) =>
            a.localeCompare(b),
          ),
        }
      : collection,
  );

export const removeFromCollection = (
  collections: Collection[],
  id: string,
  familyNames: string[],
): Collection[] => {
  const removed = new Set(familyNames);
  return collections.map((collection) =>
    collection.id === id
      ? { ...collection, familyNames: collection.familyNames.filter((name) => !removed.has(name)) }
      : collection,
  );
};
