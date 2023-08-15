import { useEffect, useMemo, useState } from "react";

import { Box } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useAtomValue } from "jotai";

import FontCards from "~/components/FontCards";
import {
  familyKeywordAtom,
  favoriteFamiliesAtom,
  jaFilterAtom,
} from "~/utils/jotai";

const FavoritePage: React.FC = () => {
  const jaFilter = useAtomValue(jaFilterAtom);
  const familyKeyword = useAtomValue(familyKeywordAtom);
  const favoriteFamilies = useAtomValue(favoriteFamiliesAtom);
  const [familyList, setFamilyList] = useState<string[] | null>(null);

  const getFontNameList = async () => {
    const familyNameList: string[] = await invoke(
      jaFilter ? "get_ja_families" : "get_families",
      {
        keyword: familyKeyword,
      }
    );
    const filteredFamilyList = familyNameList.filter((family) =>
      favoriteFamilies.includes(family)
    );
    setFamilyList(filteredFamilyList);
  };

  useEffect(() => {
    getFontNameList();
  }, [familyKeyword, jaFilter]);

  const FontsMemo = useMemo(
    () => (
      <>
        {familyList ? (
          <FontCards familyList={familyList} />
        ) : (
          <p>フォントを取得中</p>
        )}
      </>
    ),
    [familyList]
  );

  return <Box p="1rem">{FontsMemo}</Box>;
};

export default FavoritePage;
