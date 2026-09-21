import { useAtom, useAtomValue } from "jotai";

import { PreviewText } from "~/features/preview/preview-text";

import { fontSizeAtom, isItalicAtom, previewTextAtom, weightAtom } from "./atoms";
import { routeAtom } from "./route";
import { nearestStyle } from "./weight";

import type { FamilySummary } from "~/lib/types";

export const VerticalColumns = ({ families }: { families: FamilySummary[] }) => {
  const text = useAtomValue(previewTextAtom);
  const size = useAtomValue(fontSizeAtom);
  const weight = useAtomValue(weightAtom);
  const isItalic = useAtomValue(isItalicAtom);
  const [, setRoute] = useAtom(routeAtom);

  return (
    <div className="flex h-full gap-6 overflow-x-auto px-4 py-3">
      {families.map((family) => (
        <button
          key={family.name}
          type="button"
          onClick={() => setRoute({ name: "detail", familyName: family.name })}
          className="flex shrink-0 flex-col items-center gap-2 rounded-md px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <PreviewText
            faceId={nearestStyle(family, weight, isItalic)?.faceId}
            text={text}
            size={size}
            orientation="vertical"
          />
          <span className="max-w-24 truncate text-xs text-neutral-500">{family.name}</span>
        </button>
      ))}
    </div>
  );
};
