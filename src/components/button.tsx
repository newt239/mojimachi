import type { ComponentProps } from "react";

import { cx } from "~/lib/cx";

export const Button = ({
  className,
  variant = "ghost",
  ...props
}: ComponentProps<"button"> & { variant?: "ghost" | "solid" | "outline" }) => (
  <button
    type="button"
    className={cx(
      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
      "disabled:cursor-not-allowed disabled:opacity-40",
      variant === "ghost" && "hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60",
      variant === "solid" &&
        "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300",
      variant === "outline" &&
        "border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
      className,
    )}
    {...props}
  />
);
