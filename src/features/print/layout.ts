export const PAGE = { width: 210, height: 297, margin: 12 } as const;
export const MM_PER_PT = 25.4 / 72;

export const WATERFALL_SIZES = [8, 10, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

export const contentWidth = PAGE.width - PAGE.margin * 2;
export const contentHeight = PAGE.height - PAGE.margin * 2 - 8;

export const chunk = <T>(items: T[], size: number): T[][] => {
  if (size <= 0) {
    return items.length === 0 ? [] : [items];
  }
  const pages: T[][] = [];
  for (let at = 0; at < items.length; at += size) {
    pages.push(items.slice(at, at + size));
  }
  return pages;
};

// 見出しとサンプル 1 行で 1 行ぶん
export const catalogRowsPerPage = (sampleSize: number) => {
  if (sampleSize <= 0) {
    return 0;
  }
  const rowHeight = sampleSize * MM_PER_PT * 1.6 + 5;
  return Math.max(1, Math.floor(contentHeight / rowHeight));
};

export const gridCapacity = (sampleSize: number) => {
  const cell = sampleSize * MM_PER_PT * 1.8;
  if (cell <= 0) {
    return { columns: 0, rows: 0, total: 0 };
  }
  const columns = Math.max(1, Math.floor(contentWidth / cell));
  const rows = Math.max(1, Math.floor((contentHeight - 8) / cell));
  return { columns, rows, total: columns * rows };
};

export const waterfallFamiliesPerPage = () => {
  const stack = WATERFALL_SIZES.reduce((total, size) => total + size * MM_PER_PT * 1.4, 0) + 8;
  return stack <= 0 ? 0 : Math.max(1, Math.floor(contentHeight / stack));
};

export type PrintInput = {
  style: "catalog" | "repertoire" | "waterfall";
  familyNames: string[];
  sampleSize: number;
  glyphCount: number;
};

export const estimatePageCount = (input: PrintInput) => {
  if (input.familyNames.length === 0) {
    return 0;
  }
  if (input.style === "catalog") {
    return chunk(input.familyNames, catalogRowsPerPage(input.sampleSize)).length;
  }
  if (input.style === "waterfall") {
    return chunk(input.familyNames, waterfallFamiliesPerPage()).length;
  }
  const capacity = gridCapacity(input.sampleSize).total;
  const perFamily = capacity === 0 ? 1 : Math.max(1, Math.ceil(input.glyphCount / capacity));
  return input.familyNames.length * perFamily;
};
