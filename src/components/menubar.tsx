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
import { MoonIcon, SunIcon, XIcon } from "@phosphor-icons/react";
import { useAtom } from "jotai";

import { displayModeAtom, familyKeywordAtom } from "#/utils/jotai";

export const Menubar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [displayMode, setDisplayMode] = useAtom(displayModeAtom);
  const [familyKeyword, setFamilyKeyword] = useAtom(familyKeywordAtom);

  return (
    <Box
      as="header"
      sx={{
        _dark: {
          bgColor: "gray.900",
        },
        bgColor: "purple.50",
        h: "3.5rem",
        height: "3.5rem",
        p: "0.5rem",
        position: "fixed",
        right: "15rem",
        top: "4rem",
        width: "calc(100% - 15rem)",
        zIndex: 10,
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" gap="0.5rem">
        <InputGroup>
          <Input
            placeholder="フォントを検索"
            value={familyKeyword}
            onChange={(e) => {
              setFamilyKeyword(e.target.value);
            }}
            variant="outline"
            sx={{
              _dark: {
                borderColor: "gray.600",
              },
              _focusVisible: {
                borderColor: "purple.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
              },
              borderColor: "gray.300",
            }}
          />
          {familyKeyword !== "" && (
            <InputRightElement>
              <IconButton
                aria-label="リセット"
                size="sm"
                colorScheme="purple"
                variant="ghost"
                onClick={() => {
                  setFamilyKeyword("");
                }}
              >
                <XIcon weight="bold" />
              </IconButton>
            </InputRightElement>
          )}
        </InputGroup>
        <Select
          w="10rem"
          value={displayMode}
          onChange={(e) => {
            setDisplayMode(e.target.value === "vertical" ? "vertical" : "normal");
          }}
          sx={{
            _dark: {
              borderColor: "gray.600",
              option: {
                backgroundColor: "gray.900",
              },
            },
            _focusVisible: {
              borderColor: "purple.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
            },
            borderColor: "gray.300",
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
          {colorMode === "light" ? <SunIcon weight="bold" /> : <MoonIcon weight="bold" />}
        </IconButton>
      </Flex>
    </Box>
  );
};
