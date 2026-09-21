import { StarIcon } from "@phosphor-icons/react";
import { useAtom, useAtomValue } from "jotai";

import { IconButton } from "~/components/icon-button";
import { PreviewText } from "~/features/preview/preview-text";
import { cx } from "~/lib/cx";

import {
  favoritesAtom,
  fontSizeAtom,
  isItalicAtom,
  orientationAtom,
  previewTextAtom,
  weightAtom,
} from "./atoms";
import { toggleFavorite } from "./selectors";
import { nearestStyle } from "./weight";

import type { FamilySummary } from "~/lib/types";

export const FontRow = ({
  family,
  selected,
  onSelect,
}: {
  family: FamilySummary;
  selected: boolean;
  onSelect: (event: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean }) => void;
}) => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const text = useAtomValue(previewTextAtom);
  const size = useAtomValue(fontSizeAtom);
  const weight = useAtomValue(weightAtom);
  const isItalic = useAtomValue(isItalicAtom);
  const orientation = useAtomValue(orientationAtom);

  const style = nearestStyle(family, weight, isItalic);
  const isFavorite = favorites.includes(family.name);
  const italicMissing = isItalic && !family.hasItalic;

  return (
    <div
      role="row"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSelect(event);
        }
      }}
      className={cx(
        "flex h-full cursor-default flex-col justify-center gap-1 border-b border-neutral-100 px-4 dark:border-neutral-800",
        selected
          ? "bg-blue-50 dark:bg-blue-950/40"
          : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
      )}
    >
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <IconButton
          label={isFavorite ? "お気に入りから外す" : "お気に入りに追加"}
          onClick={(event) => {
            event.stopPropagation();
            setFavorites(toggleFavorite(favorites, family.name));
          }}
        >
          <StarIcon size={14} weight={isFavorite ? "fill" : "regular"} />
        </IconButton>
        <span className="truncate font-medium text-neutral-800 dark:text-neutral-100">
          {family.name}
        </span>
        <span className="truncate">{style?.styleName ?? "スタイルなし"}</span>
        {italicMissing && (
          <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] dark:bg-neutral-700">
            斜体なし
          </span>
        )}
        {style?.isVariable === true && (
          <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] dark:bg-neutral-700">
            可変
          </span>
        )}
      </div>
      <PreviewText
        faceId={style?.faceId}
        text={text}
        size={size}
        orientation={orientation}
        className="truncate"
      />
    </div>
  );
};
