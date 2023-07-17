import { Box, Flex, Input, Select } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { displayModeAtom, familyKeywordAtom } from "~/utils/jotai";

const Menubar: React.FC = () => {
  const [displayMode, setDisplayMode] = useAtom(displayModeAtom);
  const [familyKeyword, setFamilyKeyword] = useAtom(familyKeywordAtom);

  return (
    <Box
      as="header"
      bg="gray.900"
      position="fixed"
      top="4rem"
      right="20rem"
      w="calc(100% - 20rem)"
      zIndex={10}
      p="0.5rem"
      pt="0"
      h="4rem"
    >
      <Flex alignItems={"center"} justifyContent={"space-between"} gap="0.5rem">
        <Input
          placeholder="フォントを検索"
          value={familyKeyword}
          onChange={(e) => setFamilyKeyword(e.target.value)}
          variant="outline"
        />
        <Select
          w="10rem"
          value={displayMode}
          onChange={(e) =>
            setDisplayMode(e.target.value as "normal" | "vertical")
          }
        >
          <option value="normal">通常</option>
          <option value="vertical">垂直</option>
        </Select>
      </Flex>
    </Box>
  );
};

export default Menubar;
