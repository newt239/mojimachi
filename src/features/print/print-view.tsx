import { PreviewText } from "~/features/preview/preview-text";

import {
  chunk,
  catalogRowsPerPage,
  gridCapacity,
  WATERFALL_SIZES,
  waterfallFamiliesPerPage,
} from "./layout";
import { PrintPage } from "./print-page";

import type { PrintStyle } from "~/features/fonts/atoms";
import type { FamilySummary } from "~/lib/types";

type Props = {
  style: PrintStyle;
  families: FamilySummary[];
  sampleText: string;
  sampleSize: number;
  faceIdOf: (family: FamilySummary) => string | undefined;
  glyphsOf: (family: FamilySummary) => number[];
};

export const PrintView = ({
  style,
  families,
  sampleText,
  sampleSize,
  faceIdOf,
  glyphsOf,
}: Props) => {
  if (style === "catalog") {
    const pages = chunk(families, catalogRowsPerPage(sampleSize));
    return (
      <div className="print-root">
        {pages.map((page, index) => (
          <PrintPage key={page[0]?.name ?? index} index={index} total={pages.length}>
            {page.map((family) => (
              <div key={family.name} className="flex flex-col gap-0.5 py-1">
                <span className="text-[8pt] text-neutral-500">{family.name}</span>
                <PreviewText
                  faceId={faceIdOf(family)}
                  text={sampleText}
                  size={sampleSize}
                  className="truncate"
                />
              </div>
            ))}
          </PrintPage>
        ))}
      </div>
    );
  }

  if (style === "waterfall") {
    const pages = chunk(families, waterfallFamiliesPerPage());
    return (
      <div className="print-root">
        {pages.map((page, index) => (
          <PrintPage key={page[0]?.name ?? index} index={index} total={pages.length}>
            {page.map((family) => (
              <div key={family.name} className="flex flex-col gap-1 py-2">
                <span className="text-[8pt] text-neutral-500">{family.name}</span>
                {WATERFALL_SIZES.map((size) => (
                  <div key={size} className="flex items-baseline gap-2">
                    <span className="w-8 shrink-0 text-right text-[7pt] text-neutral-400">
                      {size}
                    </span>
                    <PreviewText
                      faceId={faceIdOf(family)}
                      text={sampleText}
                      size={size}
                      className="truncate"
                    />
                  </div>
                ))}
              </div>
            ))}
          </PrintPage>
        ))}
      </div>
    );
  }

  const capacity = gridCapacity(sampleSize);
  const pages = families.flatMap((family) =>
    chunk(glyphsOf(family), capacity.total).map((codePoints) => ({ family, codePoints })),
  );

  return (
    <div className="print-root">
      {pages.map((page, index) => (
        <PrintPage
          key={`${page.family.name}-${page.codePoints[0] ?? index}`}
          index={index}
          total={pages.length}
        >
          <span className="pb-1 text-[8pt] text-neutral-500">{page.family.name}</span>
          <div
            className="grid gap-px"
            style={{ gridTemplateColumns: `repeat(${capacity.columns}, minmax(0, 1fr))` }}
          >
            {page.codePoints.map((code) => (
              <span key={code} className="flex aspect-square items-center justify-center">
                <PreviewText
                  faceId={faceIdOf(page.family)}
                  text={String.fromCodePoint(code)}
                  size={sampleSize}
                />
              </span>
            ))}
          </div>
        </PrintPage>
      ))}
    </div>
  );
};
