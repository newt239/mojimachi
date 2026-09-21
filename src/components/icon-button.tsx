import type { ComponentProps } from "react";

import * as RadixTooltip from "@radix-ui/react-tooltip";

import { cx } from "~/lib/cx";

export const IconButton = ({
  label,
  className,
  ...props
}: ComponentProps<"button"> & { label: string }) => (
  <RadixTooltip.Root>
    <RadixTooltip.Trigger asChild>
      <button
        type="button"
        aria-label={label}
        className={cx(
          "inline-flex size-7 items-center justify-center rounded-md transition-colors",
          "hover:bg-neutral-200/70 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-700/60",
          className,
        )}
        {...props}
      />
    </RadixTooltip.Trigger>
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={4}
        className="z-50 rounded bg-neutral-900 px-2 py-1 text-xs text-white shadow dark:bg-neutral-100 dark:text-neutral-900"
      >
        {label}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  </RadixTooltip.Root>
);
