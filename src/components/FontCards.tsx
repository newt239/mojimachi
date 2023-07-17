import { Spacer, Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import FontCard from "./FontCard";

import { displayModeAtom } from "~/utils/jotai";

type EachFontProps = {
  familyList: string[];
};

const FontCards: React.FC<EachFontProps> = ({ familyList }) => {
  const displayMode = useAtomValue(displayModeAtom);

  return (
    <Stack
      gap="0.5rem"
      direction={displayMode === "vertical" ? "row" : "column"}
    >
      {familyList.map((family) => (
        <FontCard key={family} family_name={family} />
      ))}
      <Spacer w="1rem" h="1rem" />
    </Stack>
  );
};

export default FontCards;
