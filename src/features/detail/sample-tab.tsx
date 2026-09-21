import { useAtom } from "jotai";

import { Field } from "~/components/field";
import { Slider } from "~/components/slider";
import {
  detailBackgroundAtom,
  detailForegroundAtom,
  detailLineSpacingAtom,
  detailSampleSizeAtom,
  detailSampleTextAtom,
} from "~/features/fonts/atoms";
import { faceFamily } from "~/lib/font-face-registry";

const settings = (values: Record<string, number>) => {
  const entries = Object.entries(values);
  return entries.length === 0
    ? undefined
    : entries.map(([tag, value]) => `"${tag}" ${value}`).join(", ");
};

export const SampleTab = ({
  faceId,
  variations,
  features,
}: {
  faceId: string;
  variations: Record<string, number>;
  features: Record<string, number>;
}) => {
  const [text, setText] = useAtom(detailSampleTextAtom);
  const [size, setSize] = useAtom(detailSampleSizeAtom);
  const [lineSpacing, setLineSpacing] = useAtom(detailLineSpacingAtom);
  const [foreground, setForeground] = useAtom(detailForegroundAtom);
  const [background, setBackground] = useAtom(detailBackgroundAtom);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-4 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <Field label={`サイズ ${Math.round(size)}px`}>
          <Slider label="文字サイズ" value={size} min={8} max={160} onChange={setSize} />
        </Field>
        <Field label={`行間 ${Math.round(lineSpacing)}px`}>
          <Slider label="行間" value={lineSpacing} min={0} max={60} onChange={setLineSpacing} />
        </Field>
        <Field label="文字色">
          <input
            type="color"
            aria-label="文字色"
            value={foreground}
            onChange={(event) => setForeground(event.target.value)}
            className="size-7 cursor-pointer rounded border border-neutral-300 dark:border-neutral-700"
          />
        </Field>
        <Field label="背景色">
          <input
            type="color"
            aria-label="背景色"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="size-7 cursor-pointer rounded border border-neutral-300 dark:border-neutral-700"
          />
        </Field>
      </div>

      <textarea
        aria-label="ためしがき"
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck={false}
        className="mj-preview min-h-0 flex-1 resize-none p-6 outline-none"
        style={{
          ["--mj-face" as string]: `"${faceFamily(faceId)}"`,
          fontSize: `${size}px`,
          lineHeight: `${size + lineSpacing}px`,
          color: foreground,
          backgroundColor: background,
          fontVariationSettings: settings(variations),
          fontFeatureSettings: settings(features),
        }}
      />
    </div>
  );
};
