import { useEffect, useState } from "react";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useAtom } from "jotai";

import { searchAtom } from "./atoms";

export const SearchField = () => {
  const [search, setSearch] = useAtom(searchAtom);
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(draft), 200);
    return () => clearTimeout(timer);
  }, [draft, setSearch]);

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2 py-1 dark:border-neutral-700">
      <MagnifyingGlassIcon size={14} className="text-neutral-500" />
      <input
        aria-label="フォントを検索"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="フォント名で検索"
        className="w-48 bg-transparent text-sm outline-none"
      />
    </div>
  );
};
