import { useMemo } from "react";

import { useAtomValue } from "jotai";

import { Empty } from "~/components/empty";
import { TooltipProvider } from "~/components/tooltip-provider";

import { DetailView } from "./features/detail/detail-view";
import {
  coverageResultAtom,
  favoritesAtom,
  japaneseOnlyAtom,
  scopeAtom,
  searchAtom,
  selectionAtom,
} from "./features/fonts/atoms";
import { FontList } from "./features/fonts/font-list";
import { routeAtom } from "./features/fonts/route";
import { SearchField } from "./features/fonts/search-field";
import { visibleFamilies } from "./features/fonts/selectors";
import { Sidebar } from "./features/fonts/sidebar";
import { useCatalog } from "./features/fonts/use-catalog";
import { PreviewBar } from "./features/preview/preview-bar";

export const App = () => {
  const { families, isScanning, error, reload } = useCatalog();
  const search = useAtomValue(searchAtom);
  const japaneseOnly = useAtomValue(japaneseOnlyAtom);
  const scope = useAtomValue(scopeAtom);
  const favorites = useAtomValue(favoritesAtom);
  const coverage = useAtomValue(coverageResultAtom);
  const selection = useAtomValue(selectionAtom);
  const route = useAtomValue(routeAtom);

  const visible = useMemo(
    () =>
      visibleFamilies(families, {
        search,
        japaneseOnly,
        scope,
        favorites,
        coverageNames: coverage?.familyNames ?? null,
        collectionMembers: null,
      }),
    [families, search, japaneseOnly, scope, favorites, coverage],
  );

  const detailFamily = useMemo(
    () =>
      route.name === "detail"
        ? families.find((family) => family.name === route.familyName)
        : undefined,
    [families, route],
  );

  const counts = useMemo(
    () => ({
      all: families.length,
      favorites: families.filter((family) => favorites.includes(family.name)).length,
      duplicates: 0,
    }),
    [families, favorites],
  );

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex h-full bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <Sidebar counts={counts} onReload={() => void reload(true)} isScanning={isScanning} />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
            <SearchField />
            <p className="ml-auto text-xs text-neutral-500">
              {visible.length} ファミリー
              {selection.length > 0 && ` ・ ${selection.length} 件選択`}
            </p>
          </div>

          <PreviewBar />

          <div className="min-h-0 flex-1">
            {error !== null && <Empty title="フォントを読み込めませんでした" hint={error} />}
            {error === null && isScanning && families.length === 0 && (
              <Empty title="フォントを読み込んでいます" />
            )}
            {error === null && route.name === "list" && !(isScanning && families.length === 0) && (
              <FontList families={visible} />
            )}
            {error === null && route.name === "detail" && detailFamily !== undefined && (
              <DetailView key={detailFamily.name} family={detailFamily} />
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};
