import { Button } from "~/components/button";
import { Slider } from "~/components/slider";

import type { VariationAxis } from "~/lib/types";

export const AxesPanel = ({
  axes,
  values,
  onChange,
  onReset,
}: {
  axes: VariationAxis[];
  values: Record<string, number>;
  onChange: (tag: string, value: number) => void;
  onReset: () => void;
}) => {
  if (axes.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium text-neutral-500">可変フォントの軸</h2>
        <Button onClick={onReset}>既定値に戻す</Button>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {axes.map((axis) => {
          const value = values[axis.tag] ?? axis.default;
          return (
            <div key={axis.tag} className="flex items-center gap-2">
              <span className="w-28 truncate text-xs" title={axis.name}>
                {axis.name}
              </span>
              <Slider
                label={axis.name}
                value={value}
                min={axis.min}
                max={axis.max}
                step={(axis.max - axis.min) / 100}
                onChange={(next) => onChange(axis.tag, next)}
              />
              <span className="w-24 text-right text-xs text-neutral-500">
                {Math.round(value * 100) / 100}
                <span className="ml-1 opacity-60">{axis.tag}</span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
