import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, ScrollArea, Stack, Tabs, Text, Title } from "@mantine/core";

import { useAtomValue } from "jotai";
import opentype from "opentype.js";

import { textAtom } from "~/jotai/atoms";
import { FontData } from "~/types/FontData";

const FontPage: React.FC = () => {
  const { fontFamily } = useParams();
  const [fonts, setFonts] = useState<FontData[]>([]);
  const text = useAtomValue(textAtom);

  const loadFontData = async () => {
    if (!fontFamily) return;
    const availableFonts: FontData[] = await window.queryLocalFonts({
      families: [fontFamily],
    });
    const filledFonts = availableFonts.filter((font) =>
      font.family.includes(fontFamily)
    );
    setFonts(filledFonts);
    const blob = await filledFonts[0].blob();
    const font = opentype.parse(await blob.arrayBuffer());
    console.log(font);
  };

  useEffect(() => {
    loadFontData();
  }, [fontFamily]);

  return (
    <div>
      {fonts.length > 0 && (
        <>
          <Title order={2} fz={75} mb={100}>
            {fonts[0].family}
          </Title>

          <Tabs defaultValue="info" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="info">Info</Tabs.Tab>
              <Tabs.Tab value="weights">Weights</Tabs.Tab>
              <Tabs.Tab value="lab">Lab</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="info" pt="xs">
              Gallery tab content
            </Tabs.Panel>

            <Tabs.Panel value="weights" pt="xs">
              <Stack>
                {fonts.map((font) => (
                  <Box key={font.fullName}>
                    <Title order={3}>{font.fullName}</Title>
                    <ScrollArea w="100%">
                      <Text
                        fz={50}
                        sx={{ whiteSpace: "nowrap" }}
                        style={{
                          fontFamily: font.fullName,
                          fontWeight: font.style,
                        }}
                      >
                        {text}
                      </Text>
                    </ScrollArea>
                  </Box>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="lab" pt="xs">
              lab tab content
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FontPage;
