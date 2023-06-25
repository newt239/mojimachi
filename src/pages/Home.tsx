import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api";

import EachFont from "~/components/EachFont";

const HomePage: React.FC = () => {
  const [familyList, setFamilyList] = useState<string[]>([]);

  const getFontNameList = async () => {
    const familiyNameList: string[] = await invoke("get_families");
    console.log(familiyNameList);
    setFamilyList(familiyNameList);
  };

  useEffect(() => {
    getFontNameList();
  }, []);

  return (
    <>
      {familyList.map((family) => (
        <EachFont key={family} family_name={family} />
      ))}
    </>
  );
};

export default HomePage;
