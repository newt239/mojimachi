import { useEffect, useMemo, useState } from "react";

import { Box } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useAtomValue } from "jotai";

import FontCards from "~/components/FontCards";
import { familyKeywordAtom, jaFilterAtom } from "~/utils/jotai";

const HomePage: React.FC = () => {
  const jaFilter = useAtomValue(jaFilterAtom);
  const familyKeyword = useAtomValue(familyKeywordAtom);
  const [familyList, setFamilyList] = useState<string[] | null>(null);

  const getFontNameList = async () => {
    const familyNameList: string[] = await invoke(
      jaFilter ? "get_ja_families" : "get_families",
      {
        keyword: familyKeyword,
      }
    );
    setFamilyList(familyNameList);
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
          <p>フォントを取得中...</p>
        )}
      </>
    ),
    [familyList]
  );

  return <Box p="1rem">{FontsMemo}</Box>;
};

export default HomePage;
