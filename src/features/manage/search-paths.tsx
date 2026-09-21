import { useEffect, useState } from "react";

import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { open } from "@tauri-apps/plugin-dialog";

import { Button } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { addSearchPath, listSearchPaths, removeSearchPath } from "~/lib/ipc";

// Adobe Fonts の同期フォントのように、標準の場所にないフォントを拾うための逃げ道
export const SearchPaths = ({ onChanged }: { onChanged: () => void }) => {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    void listSearchPaths()
      .then(setPaths)
      .catch(() => setPaths([]));
  }, []);

  const add = async () => {
    const picked = await open({ directory: true, title: "フォントを探すフォルダを選ぶ" });
    if (typeof picked !== "string") {
      return;
    }
    setPaths(await addSearchPath(picked));
    onChanged();
  };

  const remove = async (path: string) => {
    setPaths(await removeSearchPath(path));
    onChanged();
  };

  return (
    <div className="flex flex-col gap-1 border-t border-neutral-200 pt-3 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">検索パス</p>
        <IconButton label="検索パスを追加" onClick={() => void add()}>
          <PlusIcon size={14} />
        </IconButton>
      </div>
      {paths.length === 0 ? (
        <Button className="justify-start text-xs text-neutral-500" onClick={() => void add()}>
          フォルダを追加して探す
        </Button>
      ) : (
        paths.map((path) => (
          <div key={path} className="flex items-center gap-1">
            <span className="min-w-0 flex-1 truncate text-xs" title={path}>
              {path}
            </span>
            <IconButton label={`${path} を検索パスから外す`} onClick={() => void remove(path)}>
              <XIcon size={12} />
            </IconButton>
          </div>
        ))
      )}
    </div>
  );
};
