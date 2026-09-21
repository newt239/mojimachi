import { Button } from "~/components/button";
import { PreviewText } from "~/features/preview/preview-text";

import { applyFeature } from "./apply-feature";

import type { FontFeature } from "~/lib/types";

export const FeaturesPanel = ({
  faceId,
  features,
  values,
  onChange,
  onReset,
}: {
  faceId: string;
  features: FontFeature[];
  values: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
  onReset: () => void;
}) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium text-neutral-500">OpenType 機能</h2>
        <Button onClick={onReset}>既定値に戻す</Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-1.5">
        {features.map((feature) => {
          const enabled = values[feature.tag] === 1;
          return (
            <button
              key={feature.tag}
              type="button"
              title={`${feature.label}（${feature.tag}）`}
              onClick={() =>
                onChange(
                  applyFeature({ current: values, features, tag: feature.tag, enabled: !enabled }),
                )
              }
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-left ${
                enabled
                  ? "border-neutral-500 bg-neutral-100 dark:border-neutral-400 dark:bg-neutral-700"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs">{feature.label}</span>
                <span className="block text-[10px] text-neutral-500">{feature.tag}</span>
              </span>
              <PreviewText
                faceId={faceId}
                text={feature.sample}
                size={18}
                features={enabled ? { [feature.tag]: 1 } : {}}
                className="shrink-0 truncate"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};
