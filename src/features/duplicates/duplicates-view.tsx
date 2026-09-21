import { useEffect, useState } from "react";

import { FolderOpenIcon } from "@phosphor-icons/react";
import { useAtom } from "jotai";

import { Button } from "~/components/button";
import { Empty } from "~/components/empty";
import { Switch } from "~/components/switch";
import { showsSystemDuplicatesAtom } from "~/features/fonts/atoms";
import { listDuplicates, revealPath, uninstallFaces } from "~/lib/ipc";

import type { DuplicateGroup } from "~/lib/types";

export const DuplicatesView = ({ onChanged }: { onChanged: () => void }) => {
  const [showsSystem, setShowsSystem] = useAtom(showsSystemDuplicatesAtom);
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [failure, setFailure] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void listDuplicates(showsSystem)
      .then((next) => {
        if (active) {
          setGroups(next);
          setFailure(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setFailure(error instanceof Error ? error.message : String(error));
        }
      });
    return () => {
      active = false;
    };
  }, [showsSystem]);

  const resolve = async (group: DuplicateGroup, keepFaceId: string) => {
    const targets = group.candidates
      .filter((candidate) => candidate.faceId !== keepFaceId && candidate.canUninstall)
      .map((candidate) => candidate.faceId);
    if (targets.length === 0) {
      return;
    }
    await uninstallFaces(targets);
    onChanged();
    setGroups(await listDuplicates(showsSystem));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <Switch
          label="システム標準どうしの重複も表示"
          checked={showsSystem}
          onChange={setShowsSystem}
        />
        <span className="ml-auto text-xs text-neutral-500">{groups.length} 件</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {failure !== null && <Empty title="重複を調べられませんでした" hint={failure} />}
        {failure === null && groups.length === 0 && (
          <Empty title="重複しているフォントはありません" />
        )}
        {groups.map((group) => (
          <div
            key={group.postscriptName}
            className="border-b border-neutral-100 dark:border-neutral-800"
          >
            <button
              type="button"
              onClick={() =>
                setExpanded(expanded === group.postscriptName ? null : group.postscriptName)
              }
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            >
              <span className="truncate text-sm">{group.postscriptName}</span>
              <span className="text-xs text-neutral-500">
                {group.candidates.length} 件{group.systemOnly && " ・ システム標準"}
              </span>
            </button>

            {expanded === group.postscriptName && (
              <ul className="flex flex-col gap-1 px-4 pb-3">
                {group.candidates.map((candidate) => (
                  <li
                    key={candidate.faceId}
                    className="flex items-center gap-2 rounded-md bg-neutral-50 px-2 py-1.5 dark:bg-neutral-800/60"
                  >
                    <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] dark:bg-neutral-700">
                      {candidate.sourceLabel}
                    </span>
                    {candidate.isActive && (
                      <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                        優先される見込み
                      </span>
                    )}
                    <span
                      className="min-w-0 flex-1 truncate text-xs text-neutral-500 select-text"
                      title={candidate.path}
                    >
                      {candidate.path}
                    </span>
                    <Button onClick={() => void revealPath(candidate.path)}>
                      <FolderOpenIcon size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        !group.candidates.some(
                          (other) => other.faceId !== candidate.faceId && other.canUninstall,
                        )
                      }
                      onClick={() => void resolve(group, candidate.faceId)}
                    >
                      これを残す
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
