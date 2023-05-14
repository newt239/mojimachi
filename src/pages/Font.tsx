import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Alert,
  Box,
  ScrollArea,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
} from "@mantine/core";

import { Warning } from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import opentype from "opentype.js";

import Lab from "~/components/Lab";
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
    // eslint-disable-next-line import/no-named-as-default-member
    const font = opentype.parse(await blob.arrayBuffer());
    setFontMeta({ index: 0, data: font });
  };

  useEffect(() => {
    loadFontData();
  }, [fontFamily]);

  return (
    <div>
      {fonts.length > 0 && (
        <>
          <Box mb={100}>
            <Title order={2} fz={75}>
              {fonts[0].family}
            </Title>
            <Text>
              {fontMeta ? fontMeta.data.names.fullName.ja : fonts[0].family}
            </Text>
          </Box>

          <Tabs defaultValue="info" variant="pills" color="yellow">
            <Tabs.List>
              <Tabs.Tab value="info">Info</Tabs.Tab>
              <Tabs.Tab value="variants">Variants</Tabs.Tab>
              <Tabs.Tab value="lab">Lab</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="info" pt="xs">
              {fontMeta ? (
                <>
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
                      // eslint-disable-next-line import/no-named-as-default-member
                      const font = opentype.parse(await blob.arrayBuffer());
                      setFontMeta({ index, data: font });
                    }}
                    py={10}
                  />
                  <Table>
                    <tbody>
                      {Object.entries(fontMeta.data.names).map(
                        ([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value.ja ? value.ja : value.en}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </>
              ) : (
                <Text>このフォントでこの機能は利用できません。</Text>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="variants" pt="xs">
              <Alert icon={<Warning size={20} />} color="red" variant="filled">
                This feature is now experimental.
              </Alert>
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
                          fontFamily: `'${font.fullName}', '${font.family}'`,
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
              <Lab fontFamily={fonts[0].family} />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FontPage;
