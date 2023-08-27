import { Spacer, Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import FontCard from "~/components/FontCard";
import { FontInfo } from "~/types/FontData";
import { displayModeAtom } from "~/utils/jotai";

type EachFontProps = {
  familyList: FontInfo[];
};

const FontCards: React.FC<EachFontProps> = ({ familyList }) => {
  const displayMode = useAtomValue(displayModeAtom);
  const uniqueFamilyList = Array.from(
    new Map(
      familyList.map((family) => [family.postscript_name, family])
    ).values()
  );

  if (uniqueFamilyList.length === 0)
    return <>条件に合うフォントが見つかりませんでした。</>;

  return (
    <Stack
      gap="0.5rem"
      direction={displayMode === "vertical" ? "row" : "column"}
    >
      {uniqueFamilyList.map((family, i) => (
        <FontCard key={i} family_name={family.family_name} />
      ))}
      <Spacer w="1rem" h="1rem" />
    </Stack>
  );
};

export default FontCards;
