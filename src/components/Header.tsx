import { Box, Flex, Input, useColorMode } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { familyKeywordAtom } from "~/utils/jotai";

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [familyKeyword, setFamilyKeyword] = useAtom(familyKeywordAtom);

  return (
    <Box
      as="header"
      bg="gray.900"
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        p: "0.5rem",
      }}
    >
      <Flex
        h="3rem"
        alignItems={"center"}
        justifyContent={"space-between"}
        gap="0.5rem"
      >
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

export default Header;
