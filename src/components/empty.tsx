export const Empty = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
    <p className="text-sm text-neutral-600 dark:text-neutral-300">{title}</p>
    {hint !== undefined && <p className="text-xs text-neutral-500">{hint}</p>}
  </div>
);
