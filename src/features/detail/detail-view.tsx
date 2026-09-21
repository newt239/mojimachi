import { useState } from "react";

import { ArrowLeftIcon, FolderOpenIcon, StarIcon } from "@phosphor-icons/react";
import { useAtom, useSetAtom } from "jotai";

import { Button } from "~/components/button";
import { Empty } from "~/components/empty";
import { IconButton } from "~/components/icon-button";
import { DETAIL_TABS, detailTabAtom, favoritesAtom } from "~/features/fonts/atoms";
import { routeAtom } from "~/features/fonts/route";
import { toggleFavorite } from "~/features/fonts/selectors";
import { revealPath } from "~/lib/ipc";

import { AxesPanel } from "./axes-panel";
import { FeaturesPanel } from "./features-panel";
import { GlyphsTab } from "./glyphs-tab";
import { InfoTab } from "./info-tab";
import { SampleTab } from "./sample-tab";
import { useFaceDetail } from "./use-face-detail";

import type { FamilySummary } from "~/lib/types";

const TAB_LABELS: Record<(typeof DETAIL_TABS)[number], string> = {
  info: "情報",
  glyphs: "グリフ",
  sample: "ためしがき",
};

export const DetailView = ({ family }: { family: FamilySummary }) => {
  const [faceId, setFaceId] = useState(family.styles[0]?.faceId);
  const [tab, setTab] = useAtom(detailTabAtom);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const setRoute = useSetAtom(routeAtom);
  const [axisValues, setAxisValues] = useState<Record<string, number>>({});
  const [featureValues, setFeatureValues] = useState<Record<string, number>>({});

  const { detail, coverage, blocks, error } = useFaceDetail(faceId);

  const isFavorite = favorites.includes(family.name);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <IconButton label="一覧に戻る" onClick={() => setRoute({ name: "list" })}>
          <ArrowLeftIcon size={16} />
        </IconButton>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{family.name}</p>
          <p className="text-xs text-neutral-500">
            {family.styles.length} スタイル
            {detail !== null && ` ・ ${detail.glyphCount.toLocaleString("ja-JP")} 字`}
          </p>
        </div>

        <select
          aria-label="スタイル"
          value={faceId ?? ""}
          onChange={(event) => setFaceId(event.target.value)}
          className="ml-4 rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-sm dark:border-neutral-700"
        >
          {family.styles.map((style) => (
            <option key={style.faceId} value={style.faceId}>
              {style.styleName}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-1">
          <IconButton
            label={isFavorite ? "お気に入りから外す" : "お気に入りに追加"}
            onClick={() => setFavorites(toggleFavorite(favorites, family.name))}
          >
            <StarIcon size={16} weight={isFavorite ? "fill" : "regular"} />
          </IconButton>
          <IconButton
            label="ファイルの場所を開く"
            disabled={detail === null}
            onClick={() => {
              if (detail !== null) {
                void revealPath(detail.path);
              }
            }}
          >
            <FolderOpenIcon size={16} />
          </IconButton>
        </div>
      </div>

      <div className="flex gap-1 border-b border-neutral-200 px-4 dark:border-neutral-800">
        {DETAIL_TABS.map((item) => (
          <Button
            key={item}
            onClick={() => setTab(item)}
            className={
              tab === item ? "border-b-2 border-neutral-800 dark:border-neutral-200" : undefined
            }
          >
            {TAB_LABELS[item]}
          </Button>
        ))}
      </div>

      {tab !== "info" && detail !== null && (
        <>
          <AxesPanel
            axes={detail.axes}
            values={axisValues}
            onChange={(tag, value) => setAxisValues({ ...axisValues, [tag]: value })}
            onReset={() => setAxisValues({})}
          />
          <FeaturesPanel
            faceId={detail.faceId}
            features={detail.features}
            values={featureValues}
            onChange={setFeatureValues}
            onReset={() => setFeatureValues({})}
          />
        </>
      )}

      <div className="min-h-0 flex-1 overflow-hidden">
        {error !== null && <Empty title="フォントの詳細を読み込めませんでした" hint={error} />}
        {error === null && detail === null && <Empty title="読み込んでいます" />}
        {error === null && detail !== null && tab === "info" && (
          <div className="h-full overflow-y-auto">
            <InfoTab detail={detail} coverage={coverage} />
          </div>
        )}
        {error === null && detail !== null && tab === "glyphs" && (
          <GlyphsTab
            faceId={detail.faceId}
            blocks={blocks}
            variations={axisValues}
            features={featureValues}
          />
        )}
        {error === null && detail !== null && tab === "sample" && (
          <SampleTab faceId={detail.faceId} variations={axisValues} features={featureValues} />
        )}
      </div>
    </div>
  );
};
