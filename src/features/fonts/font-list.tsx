import { useEffect, useRef } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useAtom, useAtomValue } from "jotai";

import { Empty } from "~/components/empty";

import { fontSizeAtom, orientationAtom, selectionAtom } from "./atoms";
import { FontRow } from "./font-row";
import { pruneSelection, toggleSelection } from "./selectors";
import { VerticalColumns } from "./vertical-columns";

import type { FamilySummary } from "~/lib/types";

export const FontList = ({ families }: { families: FamilySummary[] }) => {
  const orientation = useAtomValue(orientationAtom);
  const size = useAtomValue(fontSizeAtom);
  const [selection, setSelection] = useAtom(selectionAtom);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowHeight = Math.round(size * 1.4) + 34;
  const virtualizer = useVirtualizer({
    count: families.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  useEffect(() => {
    const pruned = pruneSelection(selection, families);
    if (pruned.length !== selection.length) {
      setSelection(pruned);
    }
  }, [families, selection, setSelection]);

  if (families.length === 0) {
    return (
      <Empty title="該当するフォントがありません" hint="検索語や絞り込みを変えてみてください" />
    );
  }

  if (orientation === "vertical") {
    return <VerticalColumns families={families} />;
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => {
          const family = families[item.index];
          if (!family) {
            return null;
          }
          return (
            <div
              key={family.name}
              className="absolute top-0 left-0 w-full"
              style={{ height: `${item.size}px`, transform: `translateY(${item.start}px)` }}
            >
              <FontRow
                family={family}
                selected={selection.includes(family.name)}
                onSelect={(event) => {
                  setSelection(
                    event.metaKey || event.ctrlKey || event.shiftKey
                      ? toggleSelection(selection, family.name)
                      : [family.name],
                  );
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
