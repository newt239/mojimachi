import type { ReactNode } from "react";

export const PrintPage = ({
  index,
  total,
  children,
}: {
  index: number;
  total: number;
  children: ReactNode;
}) => (
  <section className="print-page">
    <div className="flex h-full flex-col overflow-hidden">{children}</div>
    <p className="print-footer text-[9pt] text-neutral-500">
      {index + 1} / {total}
    </p>
  </section>
);
