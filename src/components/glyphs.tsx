import { useEffect, useMemo, useState } from "react";

import { Box, Flex, Radio, RadioGroup, Stack } from "@chakra-ui/react";

import { unicodeRanges } from "#/utils/unicode";

type GlyphsProps = {
  font_name: string;
};

const loadFont = (postscriptName: string) => {
  const fontFace = new FontFace(postscriptName, `local('${postscriptName}')`);
  fontFace
    .load()
    .then((loadedFace) => {
      document.fonts.add(loadedFace);
    })
    .catch((error: unknown) => {
      console.error(error);
    });
};

export const Glyphs: React.FC<GlyphsProps> = ({ font_name }) => {
  const [range, setRange] = useState<string>("Basic Latin");

  useEffect(() => {
    if (font_name) {
      loadFont(font_name);
    }
  }, [font_name]);

  const glyphs = useMemo(() => {
    const { start, end } = unicodeRanges[range];
    const codePoints: string[] = [];
    for (let i = start; i < end; i++) {
      codePoints.push(String.fromCodePoint(i));
    }
    return codePoints;
  }, [range]);

  return (
    <Flex direction="row">
      <RadioGroup
        onChange={setRange}
        value={range}
        flexDirection="column"
        w="20%"
        flexGrow={1}
        maxH="60vh"
        overflowY="scroll"
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
        maxH="60vh"
        overflowY="scroll"
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
