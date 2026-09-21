import * as RadixSwitch from "@radix-ui/react-switch";

export const Switch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
    <span>{label}</span>
    <RadixSwitch.Root
      checked={checked}
      onCheckedChange={onChange}
      className="relative h-5 w-9 shrink-0 rounded-full bg-neutral-300 transition-colors data-[state=checked]:bg-neutral-700 dark:bg-neutral-700 dark:data-[state=checked]:bg-neutral-300"
    >
      <RadixSwitch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px] dark:bg-neutral-900" />
    </RadixSwitch.Root>
  </label>
);
