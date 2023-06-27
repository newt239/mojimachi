import {
  Box,
  Flex,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import { fontSizeAtom, previewStringAtom } from "~/utils/jotai";

const Menubar: React.FC = () => {
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [previewString, setPreviewString] = useAtom(previewStringAtom);

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
        {fontSize}px
      </Box>
      <Slider
        aria-label="slider-ex-1"
        defaultValue={fontSize}
        onChange={setFontSize}
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
