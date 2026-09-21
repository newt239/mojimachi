import {
  ArrowsLeftRightIcon,
  CopyIcon,
  ExportIcon,
  FolderOpenIcon,
  PrinterIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { Button } from "~/components/button";
import { revealPath } from "~/lib/ipc";

import { favoritesAtom, isItalicAtom, selectionAtom, weightAtom } from "./atoms";
import { routeAtom } from "./route";
import { bulkFavorite, comparisonTargets } from "./selectors";
import { nearestStyle } from "./weight";

import type { FaceDetail, FamilySummary } from "~/lib/types";

export const SelectionActions = ({
  families,
  onExport,
  onPrint,
  detailOf,
}: {
  families: FamilySummary[];
  onExport: () => void;
  onPrint: () => void;
  detailOf: (faceId: string) => Promise<FaceDetail>;
}) => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const selection = useAtomValue(selectionAtom);
  const weight = useAtomValue(weightAtom);
  const isItalic = useAtomValue(isItalicAtom);
  const setRoute = useSetAtom(routeAtom);

  if (selection.length === 0) {
    return null;
  }

  const selected = families.filter((family) => selection.includes(family.name));
  const firstFaceId = selected[0] && nearestStyle(selected[0], weight, isItalic)?.faceId;

  const copyPostscriptNames = async () => {
    const names = selected
      .map((family) => nearestStyle(family, weight, isItalic)?.postscriptName)
      .filter((name) => name !== undefined && name !== null);
    await writeText(names.join("\n"));
  };

  const reveal = async () => {
    if (firstFaceId === undefined) {
      return;
    }
    const detail = await detailOf(firstFaceId);
    await revealPath(detail.path);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 px-4 py-1.5 dark:border-neutral-800">
      <Button onClick={() => setFavorites(bulkFavorite(favorites, selection))}>
        <StarIcon size={14} />
        まとめてお気に入り
      </Button>
      <Button onClick={onExport}>
        <ExportIcon size={14} />
        書き出す
      </Button>
      <Button onClick={onPrint}>
        <PrinterIcon size={14} />
        プリント
      </Button>
      <Button
        disabled={comparisonTargets(selection).length === 0}
        onClick={() => setRoute({ name: "compare", familyNames: comparisonTargets(selection) })}
      >
        <ArrowsLeftRightIcon size={14} />
        並べて比較
      </Button>
      <Button onClick={() => void copyPostscriptNames()}>
        <CopyIcon size={14} />
        PostScript 名をコピー
      </Button>
      <Button disabled={firstFaceId === undefined} onClick={() => void reveal()}>
        <FolderOpenIcon size={14} />
        ファイルの場所を開く
      </Button>
    </div>
  );
};
