import { useMemo, useState } from "react";

import { Empty } from "~/components/empty";
import { PreviewText } from "~/features/preview/preview-text";

import type { BlockGlyphs } from "~/lib/types";

const parseQuery = (query: string) => {
  const trimmed = query.trim();
  if (trimmed === "") {
    return null;
  }
  const hex = /^(?:u\+)?(?<code>[0-9a-f]{2,6})$/i.exec(trimmed);
  if (hex?.groups?.["code"] !== undefined) {
    return Number.parseInt(hex.groups["code"], 16);
  }
  return [...trimmed][0]?.codePointAt(0) ?? null;
};

export const GlyphsTab = ({
  faceId,
  blocks,
  variations,
  features,
}: {
  faceId: string;
  blocks: BlockGlyphs[];
  variations: Record<string, number>;
  features: Record<string, number>;
}) => {
  const [blockId, setBlockId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const active = blocks.find((block) => block.id === blockId) ?? blocks[0];
  const wanted = parseQuery(query);

  const glyphs = useMemo(() => {
    if (wanted !== null) {
      return blocks.flatMap((block) => block.codePoints).filter((code) => code === wanted);
    }
    return active?.codePoints ?? [];
  }, [active, blocks, wanted]);

  if (blocks.length === 0) {
    return <Empty title="収録されているグリフがありません" />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <select
          aria-label="Unicode ブロック"
          value={active?.id ?? ""}
          onChange={(event) => setBlockId(Number(event.target.value))}
          className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-sm dark:border-neutral-700"
        >
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.name}（{block.codePoints.length}）
            </option>
          ))}
        </select>
        <input
          aria-label="グリフを検索"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="文字か U+XXXX で検索"
          className="w-44 rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <span className="ml-auto text-xs text-neutral-500">{glyphs.length} 字</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {glyphs.length === 0 ? (
          <Empty title="該当するグリフがありません" />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5">
            {glyphs.map((code) => {
              const char = String.fromCodePoint(code);
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(char);
                    setCopied(char);
                  }}
                  title={`U+${code.toString(16).toUpperCase().padStart(4, "0")}`}
                  className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
                >
                  <PreviewText
                    faceId={faceId}
                    text={char}
                    size={26}
                    variations={variations}
                    features={features}
                  />
                  <span className="text-[10px] text-neutral-500">
                    {code.toString(16).toUpperCase().padStart(4, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {copied !== null && (
        <p className="border-t border-neutral-200 px-4 py-1.5 text-xs text-neutral-500 dark:border-neutral-800">
          「{copied}」をコピーしました
        </p>
      )}
    </div>
  );
};
