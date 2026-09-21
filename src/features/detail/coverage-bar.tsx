import type { CharsetCoverage } from "~/lib/types";

export const CoverageBar = ({ item }: { item: CharsetCoverage }) => {
  const ratio = item.total === 0 ? 0 : item.covered / item.total;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between text-xs">
        <span>{item.name}</span>
        <span className="text-neutral-500">
          {Math.round(ratio * 100)}% ・ {item.covered} / {item.total} 字
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className="h-full rounded-full bg-neutral-600 dark:bg-neutral-300"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
};
