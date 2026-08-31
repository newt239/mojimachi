import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { CaretDownIcon, TextBIcon, TextItalicIcon } from "@phosphor-icons/react";
import { useAtom } from "jotai";

import { useFontSize } from "#/hooks/use-font-size";
import { isBoldAtom, isItalicAtom, previewStringAtom } from "#/utils/jotai";

export const Header: React.FC = () => {
  const { fontSize, setFontSize } = useFontSize({ variableName: "--font-size" });
  const [previewString, setPreviewString] = useAtom(previewStringAtom);
  const [isItalic, setIsItalic] = useAtom(isItalicAtom);
  const [isBold, setIsBold] = useAtom(isBoldAtom);

  const onChange = (e: number) => {
    setFontSize(e);
  };

  const sampleTexts = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "0123456789 ¿ ? ¡ ! & @ ‘ ’ “ ” « » % * ^ # $ £ € ¢ / ( ) [ ] { } . , ® ©",
    "The quick brown fox jumps over the lazy dog.",
    "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。",
  ];

  return (
    <Flex
      sx={{
        _dark: {
          bgColor: "gray.900",
        },
        bgColor: "purple.50",
        gap: "1rem",
        h: "4rem",
        left: 0,
        p: "0.5rem",
        position: "fixed",
        top: 0,
        w: "100%",
        zIndex: 100,
      }}
    >
      <Flex w="50%">
        <Box w="4rem" m="auto">
          {fontSize}px
        </Box>
        <Slider
          colorScheme="purple"
          aria-label="フォントサイズを変える"
          defaultValue={fontSize}
          onChange={onChange}
          min={10}
          max={100}
          focusThumbOnChange={false}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Flex>
      <Flex w="50%">
        <InputGroup>
          <Input
            placeholder="プレビューする文字"
            value={previewString}
            onChange={(e) => {
              setPreviewString(e.target.value);
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
          <InputRightElement>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<CaretDownIcon />}
                colorScheme="purple"
                variant="ghost"
                size="sm"
              />
              <MenuList>
                {sampleTexts.map((text) => (
                  <MenuItem
                    key={text}
                    onClick={() => {
                      setPreviewString(text);
                    }}
                  >
                    {text}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </InputRightElement>
        </InputGroup>
      </Flex>
      <ButtonGroup isAttached variant="outline">
        <IconButton
          colorScheme="purple"
          variant={isItalic ? "solid" : "outline"}
          aria-label="斜体"
          onClick={() => {
            setIsItalic((v) => !v);
          }}
        >
          <TextItalicIcon weight="bold" />
        </IconButton>
        <IconButton
          colorScheme="purple"
          variant={isBold ? "solid" : "outline"}
          aria-label="太字"
          onClick={() => {
            setIsBold((v) => !v);
          }}
        >
          <TextBIcon weight="bold" />
        </IconButton>
      </ButtonGroup>
    </Flex>
  );
};
