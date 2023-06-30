import { useState } from "react";

import {
  Box,
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
import { CaretDown } from "@phosphor-icons/react";
import { useAtom, useSetAtom } from "jotai";

import { fontSizeAtom, previewStringAtom } from "~/utils/jotai";

const Menubar: React.FC = () => {
  const setFontSize = useSetAtom(fontSizeAtom);
  const [localFontSize, setLocalFontSize] = useState<number>(32);
  const [previewString, setPreviewString] = useAtom(previewStringAtom);

  const onChange = (e: number) => {
    setLocalFontSize(e);
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
      bg="gray.900"
      top="4rem"
      position="sticky"
      left="15rem"
      zIndex={10}
      p="0.5rem"
      pt="0"
      gap="1rem"
    >
      <Flex w="50%">
        <Box w="4rem" m="auto">
          {localFontSize}px
        </Box>
        <Slider
          aria-label="slider-ex-1"
          defaultValue={localFontSize}
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
            onChange={(e) => setPreviewString(e.target.value)}
            variant="outline"
          />
          <InputRightElement>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<CaretDown />}
                variant="ghost"
              />
              <MenuList>
                {sampleTexts.map((text) => (
                  <MenuItem key={text} onClick={() => setPreviewString(text)}>
                    {text}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default Menubar;
