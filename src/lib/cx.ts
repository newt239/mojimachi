export const cx = (...values: (string | false | null | undefined)[]) =>
  values.filter(Boolean).join(" ");
