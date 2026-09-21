import type { ReactNode } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";

export const Sheet = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <RadixDialog.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[80vh] w-[min(34rem,90vw)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        <RadixDialog.Title className="text-sm font-medium">{title}</RadixDialog.Title>
        <RadixDialog.Description className="text-xs text-neutral-500">
          {description ?? ""}
        </RadixDialog.Description>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer !== undefined && <div className="flex justify-end gap-2">{footer}</div>}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);
