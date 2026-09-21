import { load, type Store } from "@tauri-apps/plugin-store";
import { atom, type WritableAtom } from "jotai";

export const SETTINGS = "settings.json";
export const LIBRARY = "library.json";

const FILES = [SETTINGS, LIBRARY];

const stores = new Map<string, Store>();
const cache = new Map<string, unknown>();

// WebView のストレージは消えうるので、設定とユーザーの資産は Rust 側のファイルに置く
const hydrateFile = async (file: string) => {
  try {
    const store = await load(file, { autoSave: 300 });
    stores.set(file, store);
    for (const [key, value] of await store.entries()) {
      cache.set(`${file}:${key}`, value);
    }
  } catch {
    // 読めない設定ファイルは既定値で続行する
  }
};

export const hydrateStores = () => Promise.all(FILES.map((file) => hydrateFile(file)));

export const isString = (value: unknown): value is string => typeof value === "string";
export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => isString(item));

export type PersistentOptions<T> = {
  file: string;
  key: string;
  initial: T;
  guard: (value: unknown) => value is T;
};

export const persistentAtom = <T>({
  file,
  key,
  initial,
  guard,
}: PersistentOptions<T>): WritableAtom<T, [T], void> => {
  const id = `${file}:${key}`;
  const raw = cache.get(id);
  const base = atom<T>(guard(raw) ? raw : initial);

  return atom(
    (get) => get(base),
    (_get, set, next: T) => {
      set(base, next);
      cache.set(id, next);
      void stores.get(file)?.set(key, next);
    },
  );
};

export const oneOf =
  <T extends string>(values: readonly T[]) =>
  (value: unknown): value is T =>
    isString(value) && values.some((candidate) => candidate === value);
