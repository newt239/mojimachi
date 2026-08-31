import { useEffect, useMemo } from "react";

import { Box } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/core";
import { useAtom, useAtomValue } from "jotai";

import { FontCards } from "#/components/font-cards";
import { familyKeywordAtom, familyListAtom, jaFilterAtom } from "#/utils/jotai";

import type { FontInfo } from "#/types/font";

export const HomePage: React.FC = () => {
  const jaFilter = useAtomValue(jaFilterAtom);
  const familyKeyword = useAtomValue(familyKeywordAtom);
  const [familyList, setFamilyList] = useAtom(familyListAtom);

  useEffect(() => {
    let cancelled = false;

    const getFontNameList = async () => {
      const familyNameList: FontInfo[] = await invoke("get_families", {
        ja: jaFilter,
        keyword: familyKeyword,
      });
      if (!cancelled) {
        setFamilyList(familyNameList);
      }
    };

    void getFontNameList();

    return () => {
      cancelled = true;
    };
  }, [familyKeyword, jaFilter, setFamilyList]);

  const FontsMemo = useMemo(
    () => <>{familyList ? <FontCards familyList={familyList} /> : <p>フォントを取得中...</p>}</>,
    [familyList],
  );

  return <Box p="1rem">{FontsMemo}</Box>;
};
