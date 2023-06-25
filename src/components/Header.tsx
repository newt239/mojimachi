import {
  Box,
  Button,
  Flex,
  Input,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Moon, Sun } from "@phosphor-icons/react";
import { useAtom } from "jotai";

import { familyKeywordAtom } from "~/utils/jotai";

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [familyKeyword, setFamilyKeyword] = useAtom(familyKeywordAtom);

  return (
    <Box
      as="header"
      bg={useColorModeValue("gray.100", "gray.900")}
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        px: "1rem",
      }}
    >
      <Flex
        h="3rem"
        alignItems={"center"}
        justifyContent={"space-between"}
        gap="1rem"
      >
        <Input
          placeholder="フォントを検索"
          value={familyKeyword}
          onChange={(e) => setFamilyKeyword(e.target.value)}
          boxShadow="none"
          color={useColorModeValue("black", "white")}
        />
        <Flex alignItems={"center"}>
          <Button onClick={toggleColorMode} boxShadow="none">
            {colorMode === "light" ? (
              <Moon weight="duotone" />
            ) : (
              <Sun weight="duotone" />
            )}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
