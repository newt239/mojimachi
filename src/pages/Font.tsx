import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ArrowUUpLeft } from "@phosphor-icons/react";

import { unicodeRanges } from "~/utils/unicode";

const FontPage: React.FC = () => {
  const { font_name } = useParams();
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
    <Box p="1rem">
      <Button
        as={Link}
        to="/"
        variant="ghost"
        colorScheme="orange"
        leftIcon={<ArrowUUpLeft size="1.5rem" weight="duotone" />}
      >
        戻る
      </Button>
      <Heading as="h2" size="2xl">
        {font_name}
      </Heading>
      <Tabs mt={5} colorScheme="orange">
        <TabList>
          <Tab>Info</Tab>
          <Tab>Glyphs</Tab>
          <Tab>Playground</Tab>
        </TabList>
        <TabPanels>
          <TabPanel sx={{ fontFamily: `'${font_name}', Tofu` }}></TabPanel>
          <TabPanel>
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
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FontPage;
