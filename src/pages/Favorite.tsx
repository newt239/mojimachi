import { useEffect, useMemo } from "react";

import { Box } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useAtom, useAtomValue } from "jotai";

import FontCards from "~/components/FontCards";
import { FontInfo } from "~/types/FontData";
import {
  familyKeywordAtom,
  familyListAtom,
  favoriteFamiliesAtom,
  jaFilterAtom,
} from "~/utils/jotai";

const FavoritePage: React.FC = () => {
  const jaFilter = useAtomValue(jaFilterAtom);
  const familyKeyword = useAtomValue(familyKeywordAtom);
  const favoriteFamilies = useAtomValue(favoriteFamiliesAtom);
  const [familyList, setFamilyList] = useAtom(familyListAtom);

  const getFontNameList = async () => {
    const familyNameList: FontInfo[] = await invoke("get_families", {
      ja: jaFilter,
      keyword: familyKeyword,
    });
    const filteredFamilyList = familyNameList.filter((family) =>
      favoriteFamilies.includes(family.family_name)
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
