import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import { Moon, Sun, X } from "@phosphor-icons/react";
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
        bgColor: "purple.50",
        _dark: {
          bgColor: "gray.900",
        },
      }}
    >
      <Flex alignItems={"center"} justifyContent={"space-between"} gap="0.5rem">
        <InputGroup>
          <Input
            placeholder="フォントを検索"
            value={familyKeyword}
            onChange={(e) => setFamilyKeyword(e.target.value)}
            variant="outline"
            sx={{
              borderColor: "gray.300",
              _focusVisible: {
                borderColor: "purple.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
              },
              _dark: {
                borderColor: "gray.600",
              },
            }}
          />
          {familyKeyword !== "" && (
            <InputRightElement>
              <IconButton aria-label="リセット" size="sm" variant="ghost">
                <X weight="bold" />
              </IconButton>
            </InputRightElement>
          )}
        </InputGroup>
        <Select
          w="10rem"
          value={displayMode}
          onChange={(e) => {
            setDisplayMode(e.target.value as "normal" | "vertical");
          }}
          sx={{
            borderColor: "gray.300",
            _focusVisible: {
              borderColor: "purple.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
            },
            _dark: {
              borderColor: "gray.600",
              option: {
                backgroundColor: "gray.900",
              },
            },
          }}
        >
          <option value="normal">通常</option>
          <option value="vertical">垂直</option>
        </Select>
        <IconButton
          aria-label="Toggle color mode"
          onClick={toggleColorMode}
          colorScheme="purple"
          variant="ghost"
        >
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
