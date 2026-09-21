import * as RadixSlider from "@radix-ui/react-slider";

export const Slider = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
}) => (
  <RadixSlider.Root
    aria-label={label}
    className="relative flex h-5 w-32 touch-none items-center select-none"
    value={[value]}
    min={min}
    max={max}
    step={step}
    onValueChange={([next]) => {
      if (next !== undefined) {
        onChange(next);
      }
    }}
  >
    <RadixSlider.Track className="relative h-1 grow rounded-full bg-neutral-300 dark:bg-neutral-700">
      <RadixSlider.Range className="absolute h-full rounded-full bg-neutral-600 dark:bg-neutral-300" />
    </RadixSlider.Track>
    <RadixSlider.Thumb className="block size-3.5 rounded-full border border-neutral-400 bg-white shadow dark:border-neutral-500 dark:bg-neutral-200" />
  </RadixSlider.Root>
);
