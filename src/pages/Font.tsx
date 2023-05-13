import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  ScrollArea,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
} from "@mantine/core";

import { useAtomValue } from "jotai";
import opentype from "opentype.js";

import { textAtom } from "~/jotai/atoms";
import { FontData } from "~/types/FontData";

const FontPage: React.FC = () => {
  const { fontFamily } = useParams();
  const [fonts, setFonts] = useState<FontData[]>([]);
  const [fontMeta, setFontMeta] = useState<{
    index: number;
    data: opentype.Font;
  } | null>(null);
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
    setFontMeta({ index: 0, data: font });
    console.log(font.tables.name);
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
              <Tabs.Tab value="variants">Variants</Tabs.Tab>
              <Tabs.Tab value="lab">Lab</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="info" pt="xs">
              <Select
                label="ウエイトを選択"
                placeholder="Pick one"
                defaultValue="0"
                data={fonts.map((font, i) => {
                  return { value: i.toString(), label: font.style };
                })}
                onChange={async (event) => {
                  const index = Number(event);
                  const blob = await fonts[index].blob();
                  const font = opentype.parse(await blob.arrayBuffer());
                  setFontMeta({ index, data: font });
                }}
                py={10}
              />
              {fontMeta && (
                <Table>
                  <tbody>
                    {Object.entries(fontMeta.data.names).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value.en}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="variants" pt="xs">
              <Stack>
                {fonts.map((font) => (
                  <Box key={font.fullName}>
                    <Title order={3}>{font.fullName}</Title>
                    {font.style}
                    <ScrollArea w="100%">
                      <Text
                        fz={50}
                        sx={{ whiteSpace: "nowrap" }}
                        style={{
                          fontFamily: font.family,
                          fontWeight: font.style,
                          fontStyle: font.style.includes("Italic")
                            ? "italic"
                            : "normal",
                          fontSynthesis: "none",
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
