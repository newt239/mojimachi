import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { Empty } from "~/components/empty";
import { IconButton } from "~/components/icon-button";
import { ToggleGroup } from "~/components/toggle-group";
import {
  comparisonModeAtom,
  fontSizeAtom,
  isItalicAtom,
  orientationAtom,
  previewTextAtom,
  weightAtom,
  type ComparisonMode,
} from "~/features/fonts/atoms";
import { routeAtom } from "~/features/fonts/route";
import { nearestStyle } from "~/features/fonts/weight";
import { PreviewText } from "~/features/preview/preview-text";

import type { FamilySummary } from "~/lib/types";

const ONION_COLORS = ["#2563eb", "#dc2626", "#059669", "#d97706"];

export const ComparisonView = ({ families }: { families: FamilySummary[] }) => {
  const [mode, setMode] = useAtom(comparisonModeAtom);
  const text = useAtomValue(previewTextAtom);
  const size = useAtomValue(fontSizeAtom);
  const weight = useAtomValue(weightAtom);
  const isItalic = useAtomValue(isItalicAtom);
  const orientation = useAtomValue(orientationAtom);
  const setRoute = useSetAtom(routeAtom);

  const effectiveMode: ComparisonMode = orientation === "vertical" ? "stacked" : mode;

  if (families.length < 2) {
    return <Empty title="2 書体以上を選ぶと比較できます" />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <IconButton label="一覧に戻る" onClick={() => setRoute({ name: "list" })}>
          <ArrowLeftIcon size={16} />
        </IconButton>
        <p className="text-sm">{families.length} 書体を比較</p>
        <div className="ml-auto flex items-center gap-2">
          {orientation === "vertical" && (
            <span className="text-xs text-neutral-500">縦組みでは重ねて比較できません</span>
          )}
          <ToggleGroup<ComparisonMode>
            label="比較方法"
            value={effectiveMode}
            options={[
              { value: "stacked", label: "並べて" },
              { value: "onion", label: "重ねて" },
            ]}
            onChange={setMode}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {effectiveMode === "stacked" ? (
          <div className="flex flex-col gap-5">
            {families.map((family) => (
              <div key={family.name} className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500">{family.name}</span>
                <PreviewText
                  faceId={nearestStyle(family, weight, isItalic)?.faceId}
                  text={text}
                  size={size}
                  orientation={orientation}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative" style={{ minHeight: `${size * 1.6}px` }}>
              {families.map((family, index) => (
                <span
                  key={family.name}
                  className="absolute top-0 left-0"
                  style={{ color: ONION_COLORS[index % ONION_COLORS.length], opacity: 0.55 }}
                >
                  <PreviewText
                    faceId={nearestStyle(family, weight, isItalic)?.faceId}
                    text={text}
                    size={size}
                  />
                </span>
              ))}
            </div>
            <ul className="flex flex-wrap gap-4">
              {families.map((family, index) => (
                <li key={family.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: ONION_COLORS[index % ONION_COLORS.length] }}
                  />
                  {family.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
