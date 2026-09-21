import * as RadixToggleGroup from "@radix-ui/react-toggle-group";

export const ToggleGroup = <T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) => (
  <RadixToggleGroup.Root
    type="single"
    aria-label={label}
    value={value}
    onValueChange={(next) => {
      const match = options.find((option) => option.value === next);
      if (match) {
        onChange(match.value);
      }
    }}
    className="inline-flex overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700"
  >
    {options.map((option) => (
      <RadixToggleGroup.Item
        key={option.value}
        value={option.value}
        className="px-2.5 py-1 text-xs data-[state=on]:bg-neutral-200 dark:data-[state=on]:bg-neutral-700"
      >
        {option.label}
      </RadixToggleGroup.Item>
    ))}
  </RadixToggleGroup.Root>
);
