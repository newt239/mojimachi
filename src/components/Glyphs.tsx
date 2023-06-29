import { useEffect, useState } from "react";

import { Box, Flex, Radio, RadioGroup, Stack } from "@chakra-ui/react";

import { unicodeRanges } from "~/utils/unicode";

type GlyphsProps = {
  font_name: string;
};

const Glyphs: React.FC<GlyphsProps> = ({ font_name }) => {
  const [range, setRange] = useState<string>("Basic Latin");
  const [glyphs, setGlyphs] = useState<string[]>([]);

  const loadFont = async (font_name: string) => {
    const fontFace = new FontFace(font_name, `local('${font_name}')`);
    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    if (font_name) {
      loadFont(font_name);
    }
  }, []);

  useEffect(() => {
    const newGlyphs = [];
    for (
      let i = unicodeRanges[range].start;
      i < unicodeRanges[range].end;
      i++
    ) {
      newGlyphs.push(String.fromCodePoint(i));
    }
    setGlyphs(newGlyphs);
  }, [range]);

  return (
    <Flex direction="row">
      <RadioGroup
        onChange={setRange}
        value={range}
        flexDirection="column"
        w="20%"
        flexGrow={1}
      >
        {Object.keys(unicodeRanges).map((name) => (
          <Stack key={name}>
            <Radio value={name}>{unicodeRanges[name].name}</Radio>
          </Stack>
        ))}
      </RadioGroup>
      <Flex
        flexWrap="wrap"
        w="80%"
        alignContent="flex-start"
        fontFamily={`'${font_name}', Tofu`}
      >
        {glyphs.map((glyph) => (
          <Flex
            key={glyph}
            direction="column"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.100"
            alignItems="center"
            w="10%"
          >
            <Box fontSize={32}>{glyph === " " ? "x" : glyph}</Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default Glyphs;
