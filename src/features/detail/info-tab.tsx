import { FolderOpenIcon } from "@phosphor-icons/react";

import { Button } from "~/components/button";
import { revealPath } from "~/lib/ipc";

import type { FaceDetail } from "~/lib/types";

const formatSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
};

export const InfoTab = ({ detail }: { detail: FaceDetail }) => (
  <div className="flex flex-col gap-6 p-4">
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-medium text-neutral-500">基本情報</h2>
      <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-neutral-500">種類</dt>
        <dd>{detail.formatLabel}</dd>
        <dt className="text-neutral-500">インストール場所</dt>
        <dd>{detail.sourceLabel}</dd>
        <dt className="text-neutral-500">字形数</dt>
        <dd>{detail.glyphCount.toLocaleString("ja-JP")}</dd>
        <dt className="text-neutral-500">対応言語</dt>
        <dd>{detail.languages.length === 0 ? "不明" : detail.languages.join("・")}</dd>
        <dt className="text-neutral-500">ファイルサイズ</dt>
        <dd>{formatSize(detail.fileSize)}</dd>
        <dt className="text-neutral-500">ファイル</dt>
        <dd className="flex min-w-0 items-center gap-2">
          <span className="truncate select-text" title={detail.path}>
            {detail.path}
          </span>
          <Button onClick={() => void revealPath(detail.path)}>
            <FolderOpenIcon size={14} />
            表示
          </Button>
        </dd>
      </dl>
    </section>

    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-medium text-neutral-500">name テーブル</h2>
      <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1.5 text-sm">
        {detail.names.map((entry) => (
          <div key={entry.label} className="contents">
            <dt className="text-neutral-500">{entry.label}</dt>
            <dd className="break-all select-text">{entry.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  </div>
);
