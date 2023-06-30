import { Box, Flex, Input } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { familyKeywordAtom } from "~/utils/jotai";

const Menubar: React.FC = () => {
  const [familyKeyword, setFamilyKeyword] = useAtom(familyKeywordAtom);

  return (
    <Box
      as="header"
      bg="gray.900"
      position="sticky"
      top="4rem"
      left="15rem"
      zIndex={10}
      p="0.5rem"
      pt="0"
    >
      <Flex alignItems={"center"} justifyContent={"space-between"} gap="0.5rem">
        <Input
          placeholder="フォントを検索"
          value={familyKeyword}
          onChange={(e) => setFamilyKeyword(e.target.value)}
          variant="outline"
        />
      </Flex>
    </Box>
  );
};

export default Menubar;
