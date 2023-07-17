import { useEffect, useMemo, useState } from "react";

import { Box, Stack } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useAtomValue } from "jotai";

import EachFont from "~/components/EachFont";
import Menubar from "~/components/Menubar";
import { familyKeywordAtom, jaFilterAtom } from "~/utils/jotai";

const HomePage: React.FC = () => {
  const jaFilter = useAtomValue(jaFilterAtom);
  const familyKeyword = useAtomValue(familyKeywordAtom);
  const [familyList, setFamilyList] = useState<string[]>([]);

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
    () =>
      familyList.map((family) => (
        <EachFont key={family} family_name={family} />
      )),
    []
  );

  return (
    <>
      <Menubar />
      <Box p="1rem">
        <Stack gap="0.5rem">{FontsMemo}</Stack>
      </Box>
    </>
  );
};

export default HomePage;
