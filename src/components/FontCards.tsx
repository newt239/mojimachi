import { Card, Flex, Spacer, Stack } from "@chakra-ui/react";
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

  if (displayMode === "grid") {
    return (
      <Flex
        sx={{
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        {uniqueFamilyList.map((family, i) => (
          <Card
            sx={{
              p: "0.5rem",
              w: [
                "calc(100% - 0.5rem)",
                "calc(100% - 0.5rem)",
                "calc(100% / 2 - 0.5rem)",
                "calc(100% / 3 - 0.5rem)",
                "calc(100% / 4 - 0.5rem)",
              ],
              bgColor: "purple.100",
              _dark: {
                bgColor: "gray.700",
              },
            }}
            key={i}
          >
            <FontCard family_name={family.family_name} />
          </Card>
        ))}
      </Flex>
    );
  }

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
