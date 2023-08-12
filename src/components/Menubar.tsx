import {
  Box,
  Flex,
  IconButton,
  Input,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import { Moon, Sun } from "@phosphor-icons/react";
import { useAtom } from "jotai";

import { displayModeAtom, familyKeywordAtom } from "~/utils/jotai";

const Menubar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [displayMode, setDisplayMode] = useAtom(displayModeAtom);
  const [familyKeyword, setFamilyKeyword] = useAtom(familyKeywordAtom);

  return (
    <Box
      as="header"
      sx={{
        position: "fixed",
        top: "4rem",
        right: "15rem",
        height: "3.5rem",
        width: "calc(100% - 15rem)",
        zIndex: 10,
        p: "0.5rem",
        h: "3.5rem",
        bgColor: "gray.100",
        _dark: {
          bgColor: "gray.900",
        },
      }}
    >
      <Flex alignItems={"center"} justifyContent={"space-between"} gap="0.5rem">
        <Input
          placeholder="フォントを検索"
          value={familyKeyword}
          onChange={(e) => setFamilyKeyword(e.target.value)}
          variant="outline"
          sx={{
            borderColor: "gray.300",
            _dark: {
              borderColor: "gray.600",
            },
          }}
        />
        <Select
          w="10rem"
          value={displayMode}
          onChange={(e) => {
            setDisplayMode(e.target.value as "normal" | "vertical");
          }}
          sx={{
            borderColor: "gray.300",
            _dark: {
              borderColor: "gray.600",
            },
          }}
        >
          <option value="normal">通常</option>
          <option value="vertical">垂直</option>
        </Select>
        <IconButton aria-label="Toggle color mode" onClick={toggleColorMode}>
          {colorMode === "light" ? (
            <Sun weight="bold" />
          ) : (
            <Moon weight="bold" />
          )}
        </IconButton>
      </Flex>
    </Box>
  );
};

export default Menubar;
