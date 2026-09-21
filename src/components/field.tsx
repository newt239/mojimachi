import type { ReactNode } from "react";

import * as RadixLabel from "@radix-ui/react-label";

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-center gap-2">
    <RadixLabel.Root className="text-xs whitespace-nowrap text-neutral-500">
      {label}
    </RadixLabel.Root>
    {children}
  </div>
);
