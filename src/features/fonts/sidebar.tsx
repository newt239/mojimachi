import { useEffect } from "react";

import { ArrowsClockwiseIcon, PlusIcon, StarIcon, XIcon } from "@phosphor-icons/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { IconButton } from "~/components/icon-button";
import { Switch } from "~/components/switch";
import { collectionScopeId, collectionsAtom } from "~/features/collections/atoms";
import { SearchPaths } from "~/features/manage/search-paths";
import { cx } from "~/lib/cx";
import { filterFamiliesByChars } from "~/lib/ipc";

import {
  coverageQueryAtom,
  coverageResultAtom,
  favoritesAtom,
  japaneseOnlyAtom,
  scopeAtom,
} from "./atoms";
import { routeAtom } from "./route";
import { normaliseQuery } from "./selectors";

const SCOPES = [
  { id: "all", label: "すべてのフォント" },
  { id: "favorites", label: "お気に入り" },
  { id: "duplicates", label: "重複" },
];

export const Sidebar = ({
  counts,
  onReload,
  isScanning,
}: {
  counts: Record<string, number>;
  onReload: () => void;
  isScanning: boolean;
}) => {
  const [scope, setScope] = useAtom(scopeAtom);
  const [japaneseOnly, setJapaneseOnly] = useAtom(japaneseOnlyAtom);
  const [coverageQuery, setCoverageQuery] = useAtom(coverageQueryAtom);
  const [coverage, setCoverage] = useAtom(coverageResultAtom);
  const [collections, setCollections] = useAtom(collectionsAtom);
  const favorites = useAtomValue(favoritesAtom);
  const setRoute = useSetAtom(routeAtom);

  useEffect(() => {
    const chars = normaliseQuery(coverageQuery);
    if (chars.length === 0) {
      setCoverage(null);
      return;
    }
    const timer = setTimeout(() => {
      void filterFamiliesByChars(chars.join(""))
        .then(setCoverage)
        .catch(() => setCoverage(null));
    }, 200);
    return () => clearTimeout(timer);
  }, [coverageQuery, setCoverage]);

  const select = (id: string) => {
    setScope(id);
    setRoute({ name: "list" });
  };

  const createCollection = () => {
    setCollections([
      ...collections,
      {
        id: crypto.randomUUID(),
        name: `コレクション ${collections.length + 1}`,
        familyNames: [],
      },
    ]);
  };

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 overflow-y-auto border-r border-neutral-200 p-3 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">ライブラリ</p>
        <IconButton label="フォントを再読み込み" onClick={onReload} disabled={isScanning}>
          <ArrowsClockwiseIcon size={14} className={isScanning ? "animate-spin" : undefined} />
        </IconButton>
      </div>

      <nav className="flex flex-col gap-0.5">
        {SCOPES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => select(item.id)}
            className={cx(
              "flex items-center justify-between rounded-md px-2 py-1.5 text-sm",
              scope === item.id
                ? "bg-neutral-200 dark:bg-neutral-700"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            )}
          >
            <span>{item.label}</span>
            <span className="text-xs text-neutral-500">{counts[item.id] ?? 0}</span>
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-500">コレクション</p>
          <IconButton label="コレクションを作る" onClick={createCollection}>
            <PlusIcon size={14} />
          </IconButton>
        </div>
        {collections.map((collection) => (
          <div key={collection.id} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => select(collectionScopeId(collection.id))}
              className={cx(
                "flex min-w-0 flex-1 items-center justify-between rounded-md px-2 py-1.5 text-sm",
                scope === collectionScopeId(collection.id)
                  ? "bg-neutral-200 dark:bg-neutral-700"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              <span className="truncate">{collection.name}</span>
              <span className="text-xs text-neutral-500">{collection.familyNames.length}</span>
            </button>
            <IconButton
              label={`${collection.name} を削除`}
              onClick={() => {
                setCollections(collections.filter((item) => item.id !== collection.id));
                if (scope === collectionScopeId(collection.id)) {
                  select("all");
                }
              }}
            >
              <XIcon size={12} />
            </IconButton>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <p className="text-xs font-medium text-neutral-500">絞り込み</p>
        <Switch label="日本語のみ" checked={japaneseOnly} onChange={setJapaneseOnly} />
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          この文字が使えるフォント
          <input
            value={coverageQuery}
            onChange={(event) => setCoverageQuery(event.target.value)}
            placeholder="例: 鷗外"
            className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </label>
        {coverage !== null && (
          <p className="text-xs text-neutral-500">
            {normaliseQuery(coverageQuery).length} 字で絞り込み中
            {coverage.unsupported.length > 0 && (
              <span className="mt-0.5 block text-amber-600 dark:text-amber-400">
                どのフォントにもない文字: {coverage.unsupported.join(" ")}
              </span>
            )}
          </p>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          <p className="text-xs font-medium text-neutral-500">お気に入り</p>
          {favorites.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setRoute({ name: "detail", familyName: name })}
              className="flex items-center gap-1.5 truncate rounded px-1.5 py-1 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <StarIcon size={12} weight="fill" className="shrink-0 text-amber-500" />
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      )}
      <SearchPaths onChanged={onReload} />
    </aside>
  );
};
