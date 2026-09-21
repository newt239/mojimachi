import { useState } from "react";
import { createPortal } from "react-dom";

import { useAtom, useAtomValue } from "jotai";

import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { Sheet } from "~/components/sheet";
import { Slider } from "~/components/slider";
import { ToggleGroup } from "~/components/toggle-group";
import {
  isItalicAtom,
  printSampleSizeAtom,
  printSampleTextAtom,
  printStyleAtom,
  weightAtom,
  type PrintStyle,
} from "~/features/fonts/atoms";
import { nearestStyle } from "~/features/fonts/weight";
import { pinFaces, unpinFaces } from "~/lib/font-face-registry";
import { getFaceBlocks } from "~/lib/ipc";

import { estimatePageCount } from "./layout";
import { PrintView } from "./print-view";

import type { FamilySummary } from "~/lib/types";

const STYLE_OPTIONS: { value: PrintStyle; label: string }[] = [
  { value: "catalog", label: "カタログ" },
  { value: "repertoire", label: "レパートリー" },
  { value: "waterfall", label: "ウォーターフォール" },
];

export const PrintSheet = ({
  families,
  open,
  onOpenChange,
}: {
  families: FamilySummary[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [style, setStyle] = useAtom(printStyleAtom);
  const [sampleText, setSampleText] = useAtom(printSampleTextAtom);
  const [sampleSize, setSampleSize] = useAtom(printSampleSizeAtom);
  const weight = useAtomValue(weightAtom);
  const isItalic = useAtomValue(isItalicAtom);
  const [glyphs, setGlyphs] = useState<Record<string, number[]>>({});
  const [busy, setBusy] = useState(false);

  const faceIdOf = (family: FamilySummary) => nearestStyle(family, weight, isItalic)?.faceId;
  const glyphsOf = (family: FamilySummary) => glyphs[family.name] ?? [];

  const pageCount = estimatePageCount({
    style,
    familyNames: families.map((family) => family.name),
    sampleSize,
    glyphCount:
      families.reduce((total, family) => total + glyphsOf(family).length, 0) /
      Math.max(1, families.length),
  });

  const print = async () => {
    setBusy(true);
    const faceIds = families.map((family) => faceIdOf(family)).filter((id) => id !== undefined);

    if (style === "repertoire") {
      const entries = await Promise.all(
        families.map(async (family) => {
          const faceId = faceIdOf(family);
          if (faceId === undefined) {
            return [family.name, []] as const;
          }
          const blocks = await getFaceBlocks(faceId);
          return [family.name, blocks.flatMap((block) => block.codePoints)] as const;
        }),
      );
      setGlyphs(Object.fromEntries(entries));
    }

    // LRU で外されると白紙で印刷されるため、対象を固定してから読み込みを待つ
    await pinFaces(faceIds);
    globalThis.print();
    unpinFaces(faceIds);
    setBusy(false);
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
        title="フォントを印刷する"
        description={`${families.length} 書体を印刷します`}
        footer={
          <>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              閉じる
            </Button>
            <Button
              variant="solid"
              disabled={busy || families.length === 0}
              onClick={() => void print()}
            >
              印刷
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <ToggleGroup<PrintStyle>
            label="レイアウト"
            value={style}
            options={STYLE_OPTIONS}
            onChange={setStyle}
          />
          <label className="flex flex-col gap-1 text-xs text-neutral-500">
            サンプル文字列
            <input
              value={sampleText}
              onChange={(event) => setSampleText(event.target.value)}
              className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
            />
          </label>
          <Field label={`サイズ ${Math.round(sampleSize)}pt`}>
            <Slider
              label="サンプルサイズ"
              value={sampleSize}
              min={8}
              max={72}
              onChange={setSampleSize}
            />
          </Field>
          <p className={pageCount > 50 ? "text-sm text-amber-600 dark:text-amber-400" : "text-sm"}>
            概算 {pageCount} ページ
            {pageCount > 50 && "（枚数が多いので設定を見直してください）"}
          </p>
        </div>
      </Sheet>

      {createPortal(
        <PrintView
          style={style}
          families={families}
          sampleText={sampleText}
          sampleSize={sampleSize}
          faceIdOf={faceIdOf}
          glyphsOf={glyphsOf}
        />,
        document.body,
      )}
    </>
  );
};
