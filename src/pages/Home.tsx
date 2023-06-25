import { useEffect, useState } from "react";

import { Stack } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useAtomValue } from "jotai";

import EachFont from "~/components/EachFont";
import { familyKeywordAtom } from "~/utils/jotai";

const HomePage: React.FC = () => {
  const [familyList, setFamilyList] = useState<string[]>([]);
  const familyKeyword = useAtomValue(familyKeywordAtom);

  const getFontNameList = async () => {
    const familiyNameList: string[] = await invoke("get_families", {
      keyword: familyKeyword,
    });
    console.log(familiyNameList);
    setFamilyList(familiyNameList);
  };

  useEffect(() => {
    getFontNameList();
  }, [familyKeyword]);

  return (
    <Stack gap="0.5rem">
      {familyList.map((family) => (
        <EachFont key={family} family_name={family} />
      ))}
    </Stack>
  );
};

export default HomePage;
