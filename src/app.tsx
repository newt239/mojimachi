import { useEffect, useMemo, useState } from "react";

import { listen } from "@tauri-apps/api/event";
import { useAtom, useAtomValue } from "jotai";

import { Button } from "~/components/button";
import { Empty } from "~/components/empty";
import { TooltipProvider } from "~/components/tooltip-provider";

import { addToCollection, collectionsAtom, scopeCollectionId } from "./features/collections/atoms";
import { ComparisonView } from "./features/compare/comparison-view";
import { DetailView } from "./features/detail/detail-view";
import { DuplicatesView } from "./features/duplicates/duplicates-view";
import { ExportSheet } from "./features/export/export-sheet";
import {
  coverageResultAtom,
  favoritesAtom,
  isItalicAtom,
  japaneseOnlyAtom,
  scopeAtom,
  searchAtom,
  selectionAtom,
  weightAtom,
} from "./features/fonts/atoms";
import { FontList } from "./features/fonts/font-list";
import { routeAtom } from "./features/fonts/route";
import { SearchField } from "./features/fonts/search-field";
import { SelectionActions } from "./features/fonts/selection-actions";
import { visibleFamilies } from "./features/fonts/selectors";
import { Sidebar } from "./features/fonts/sidebar";
import { useCatalog } from "./features/fonts/use-catalog";
import { nearestStyle } from "./features/fonts/weight";
import { useInstall } from "./features/manage/use-install";
import { PreviewBar } from "./features/preview/preview-bar";
import { PrintSheet } from "./features/print/print-sheet";
import { getFaceDetail } from "./lib/ipc";

export const App = () => {
  const { families, isScanning, error, reload } = useCatalog();
  const search = useAtomValue(searchAtom);
  const japaneseOnly = useAtomValue(japaneseOnlyAtom);
  const scope = useAtomValue(scopeAtom);
  const favorites = useAtomValue(favoritesAtom);
  const coverage = useAtomValue(coverageResultAtom);
  const selection = useAtomValue(selectionAtom);
  const route = useAtomValue(routeAtom);
  const weight = useAtomValue(weightAtom);
  const isItalic = useAtomValue(isItalicAtom);

  const [collections, setCollections] = useAtom(collectionsAtom);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const { report, dropping, pick, dismiss } = useInstall(() => void reload(true));

  useEffect(() => {
    const unlisten = listen("fonts://changed", () => void reload(true));
    return () => {
      void unlisten.then((stop) => stop());
    };
  }, [reload]);

  const activeCollection = useMemo(
    () => collections.find((item) => item.id === scopeCollectionId(scope)),
    [collections, scope],
  );

  const visible = useMemo(
    () =>
      visibleFamilies(families, {
        search,
        japaneseOnly,
        scope,
        favorites,
        coverageNames: coverage?.familyNames ?? null,
        collectionMembers: activeCollection?.familyNames ?? null,
      }),
    [families, search, japaneseOnly, scope, favorites, coverage, activeCollection],
  );

  const selected = useMemo(
    () => families.filter((family) => selection.includes(family.name)),
    [families, selection],
  );

  const detailFamily = useMemo(
    () =>
      route.name === "detail"
        ? families.find((family) => family.name === route.familyName)
        : undefined,
    [families, route],
  );

  const comparisonFamilies = useMemo(
    () =>
      route.name === "compare"
        ? route.familyNames
            .map((name) => families.find((family) => family.name === name))
            .filter((family) => family !== undefined)
        : [],
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

  const addToActiveCollection = () => {
    if (activeCollection !== undefined) {
      setCollections(addToCollection(collections, activeCollection.id, selection));
    }
  };

  const printTargets = selected.length > 0 ? selected : visible;
  const exportFaceIds = printTargets
    .map((family) => nearestStyle(family, weight, isItalic)?.faceId)
    .filter((faceId) => faceId !== undefined);

  const isDuplicatesScope = scope === "duplicates";
  const showList =
    error === null && route.name === "list" && !(isScanning && families.length === 0);

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex h-full bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <Sidebar counts={counts} onReload={() => void reload(true)} isScanning={isScanning} />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
            <SearchField />
            <Button variant="outline" onClick={() => void pick()}>
              フォントを追加
            </Button>
            {activeCollection !== undefined && selection.length > 0 && (
              <Button variant="outline" onClick={addToActiveCollection}>
                「{activeCollection.name}」に追加
              </Button>
            )}
            <p className="ml-auto text-xs text-neutral-500">
              {visible.length} ファミリー
              {selection.length > 0 && ` ・ ${selection.length} 件選択`}
            </p>
          </div>

          {route.name === "list" && !isDuplicatesScope && (
            <>
              <SelectionActions
                families={families}
                onExport={() => setExporting(true)}
                onPrint={() => setPrinting(true)}
                detailOf={getFaceDetail}
              />
              <PreviewBar />
            </>
          )}

          <div className="min-h-0 flex-1">
            {error !== null && <Empty title="フォントを読み込めませんでした" hint={error} />}
            {error === null && isScanning && families.length === 0 && (
              <Empty title="フォントを読み込んでいます" />
            )}
            {showList && isDuplicatesScope && (
              <DuplicatesView onChanged={() => void reload(true)} />
            )}
            {showList && !isDuplicatesScope && <FontList families={visible} />}
            {error === null && route.name === "detail" && detailFamily !== undefined && (
              <DetailView key={detailFamily.name} family={detailFamily} />
            )}
            {error === null && route.name === "compare" && (
              <ComparisonView families={comparisonFamilies} />
            )}
          </div>
        </main>
      </div>

      {dropping && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center border-4 border-dashed border-blue-400 bg-blue-500/10 text-sm">
          ドロップしてフォントをインストール
        </div>
      )}

      {report !== null && (
        <div className="fixed right-4 bottom-4 z-30 flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          <span>
            {report.installed.length} 件をインストールしました
            {report.skipped.length > 0 && ` ・ ${report.skipped.length} 件は既にあります`}
            {report.failed.length > 0 && ` ・ ${report.failed.length} 件は失敗しました`}
          </span>
          <Button onClick={dismiss}>閉じる</Button>
        </div>
      )}

      <ExportSheet faceIds={exportFaceIds} open={exporting} onOpenChange={setExporting} />
      <PrintSheet families={printTargets} open={printing} onOpenChange={setPrinting} />
    </TooltipProvider>
  );
};
