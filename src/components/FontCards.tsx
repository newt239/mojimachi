import { useEffect } from "react";

import { Spacer, Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import FontCard from "./FontCard";

import { FontInfo } from "~/types/FontData";
import { displayModeAtom } from "~/utils/jotai";

type EachFontProps = {
  familyList: FontInfo[];
};

const FontCards: React.FC<EachFontProps> = ({ familyList }) => {
  const displayMode = useAtomValue(displayModeAtom);

  useEffect(() => {
    familyList.map(async (family) => {
      const font_name = family.font_path.split("Microsoft\\Windows\\Fonts")[1];
      if (font_name) {
        console.log(`url('${family.postscript_name}')`);
        const fontFace = new FontFace(
          family.family_name,
          `local('${family.postscript_name}')`
        );
        fontFace
          .load()
          .then(function (loadedFace) {
            document.fonts.add(loadedFace);
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    });
  }, []);

  if (familyList.length === 0)
    return <>条件に合うフォントが見つかりませんでした。</>;

  return (
    <Stack
      gap="0.5rem"
      direction={displayMode === "vertical" ? "row" : "column"}
    >
      {familyList.map((family, i) => (
        <FontCard key={i} family_name={family.family_name} />
      ))}
      <Spacer w="1rem" h="1rem" />
    </Stack>
  );
};

export default FontCards;
