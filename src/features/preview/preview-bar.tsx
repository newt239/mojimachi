import { CaretDownIcon } from "@phosphor-icons/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAtom } from "jotai";

import { Field } from "~/components/field";
import { Separator } from "~/components/separator";
import { Slider } from "~/components/slider";
import { ToggleGroup } from "~/components/toggle-group";
import {
  fontSizeAtom,
  isItalicAtom,
  orientationAtom,
  PRESET_TEXTS,
  previewTextAtom,
  weightAtom,
  type Orientation,
} from "~/features/fonts/atoms";
import { WEIGHTS, type WeightId } from "~/features/fonts/weight";

export const PreviewBar = () => {
  const [text, setText] = useAtom(previewTextAtom);
  const [size, setSize] = useAtom(fontSizeAtom);
  const [weight, setWeight] = useAtom(weightAtom);
  const [isItalic, setIsItalic] = useAtom(isItalicAtom);
  const [orientation, setOrientation] = useAtom(orientationAtom);

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
      <div className="flex min-w-60 flex-1 items-center gap-1">
        <input
          aria-label="プレビュー文字列"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="プレビューに使う文字を入力"
          className="w-full rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            aria-label="サンプル文を選ぶ"
            className="rounded-md p-1 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60"
          >
            <CaretDownIcon size={16} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-64 rounded-md border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
            >
              {PRESET_TEXTS.map((preset) => (
                <DropdownMenu.Item
                  key={preset}
                  onSelect={() => setText(preset)}
                  className="cursor-pointer truncate rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-neutral-700"
                >
                  {preset}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <Separator />

      <Field label={`サイズ ${Math.round(size)}px`}>
        <Slider label="フォントサイズ" value={size} min={12} max={120} onChange={setSize} />
      </Field>

      <Field label="ウエイト">
        <select
          aria-label="ウエイト"
          value={weight}
          onChange={(event) => {
            const next = WEIGHTS.find((item) => item.id === event.target.value);
            if (next) {
              setWeight(next.id satisfies WeightId);
            }
          }}
          className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-xs dark:border-neutral-700"
        >
          {WEIGHTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </Field>

      <ToggleGroup
        label="斜体"
        value={isItalic ? "on" : "off"}
        options={[
          { value: "off", label: "標準" },
          { value: "on", label: "斜体" },
        ]}
        onChange={(next) => setIsItalic(next === "on")}
      />

      <ToggleGroup<Orientation>
        label="組み方向"
        value={orientation}
        options={[
          { value: "horizontal", label: "横組み" },
          { value: "vertical", label: "縦組み" },
        ]}
        onChange={setOrientation}
      />
    </div>
  );
};
