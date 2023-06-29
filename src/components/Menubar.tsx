import { useState } from "react";

import {
  Box,
  Flex,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";

import { useDebounce } from "~/hooks/useDebounce";
import { fontSizeAtom, previewStringAtom } from "~/utils/jotai";

const Menubar: React.FC = () => {
  const debounce = useDebounce(1000);
  const setFontSize = useSetAtom(fontSizeAtom);
  const [localFontSize, setLocalFontSize] = useState<number>(32);
  const [previewString, setPreviewString] = useAtom(previewStringAtom);

  const onChange = (e: number) => {
    setLocalFontSize(e);
    setFontSize(e);
  };

  return (
    <Flex
      bg="gray.900"
      top="3rem"
      position="sticky"
      left="15rem"
      zIndex={10}
      p="0.5rem"
      pt="0"
      gap="1rem"
    >
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
      <Input
        placeholder="プレビューする文字"
        value={previewString}
        onChange={(e) => setPreviewString(e.target.value)}
        variant="outline"
      />
    </Flex>
  );
};

export default Menubar;
