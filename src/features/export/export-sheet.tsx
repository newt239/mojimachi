import { useEffect, useState } from "react";

import { open } from "@tauri-apps/plugin-dialog";

import { Button } from "~/components/button";
import { Sheet } from "~/components/sheet";
import { planExport, runExport } from "~/lib/ipc";

import type { ExportPlan, ExportResult } from "~/lib/types";

export const ExportSheet = ({
  faceIds,
  open: isOpen,
  onOpenChange,
}: {
  faceIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [plan, setPlan] = useState<ExportPlan | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    void planExport(faceIds)
      .then((next) => {
        setPlan(next);
        setResult(null);
      })
      .catch(() => {
        setPlan(null);
      });
  }, [faceIds, isOpen]);

  const start = async () => {
    if (plan === null) {
      return;
    }
    const destination = await open({ directory: true, title: "書き出し先を選ぶ" });
    if (typeof destination !== "string") {
      return;
    }
    setBusy(true);
    setResult(await runExport(faceIds, destination));
    setBusy(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onOpenChange}
      title="フォントを書き出す"
      description="選んだフォントのファイルを指定したフォルダにコピーします"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            閉じる
          </Button>
          <Button
            variant="solid"
            disabled={busy || plan === null || plan.paths.length === 0}
            onClick={() => void start()}
          >
            書き出す
          </Button>
        </>
      }
    >
      {plan === null ? (
        <p className="text-sm text-neutral-500">対象を調べています</p>
      ) : (
        <div className="flex flex-col gap-2 text-sm">
          <p>{plan.paths.length} ファイルを書き出します。</p>
          {plan.excludedSystemCount > 0 && (
            <p className="text-neutral-500">
              システム領域のフォント {plan.excludedSystemCount} 件は書き出せないため除外しました。
            </p>
          )}
          {plan.missingFileCount > 0 && (
            <p className="text-neutral-500">
              ファイルを特定できなかったもの {plan.missingFileCount} 件は除外しました。
            </p>
          )}
          {plan.collectionCount > 0 && (
            <p className="text-amber-600 dark:text-amber-400">
              {plan.collectionCount}{" "}
              件はフォントコレクション（.ttc）です。選んでいない書体も一緒に書き出されます。
            </p>
          )}
          {result !== null && (
            <p className="border-t border-neutral-200 pt-2 dark:border-neutral-700">
              {result.copied.length} 件をコピーしました。
              {result.failed.length > 0 && ` ${result.failed.length} 件は失敗しました。`}
            </p>
          )}
        </div>
      )}
    </Sheet>
  );
};
