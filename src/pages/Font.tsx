import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Badge,
  Box,
  Flex,
  Select,
  Table,
  Tabs,
  Text,
  Title,
} from "@mantine/core";

import { useAtomValue } from "jotai";
import opentype from "opentype.js";

import Lab from "~/components/Lab";
import { textAtom } from "~/jotai/atoms";
import { FontData } from "~/types/FontData";

type Font = Omit<FontData & { meta?: opentype.Font }, "blob">;

const FontPage: React.FC = () => {
  const { fontFamily } = useParams();
  const [fonts, setFonts] = useState<Font[]>([]);
  const [index, setIndex] = useState(0);

  const text = useAtomValue(textAtom);

  const loadFontData = async () => {
    if (!fontFamily) return;
    const availableFonts: FontData[] = await window.queryLocalFonts({
      families: [fontFamily],
    });
    const filledFonts = availableFonts.filter((font) =>
      font.family.includes(fontFamily)
    );
    const parsedFonts = await Promise.all(
      filledFonts.map(async (font) => {
        const fontFace = new FontFace(
          font.fullName,
          `local('${font.postscriptName}')`
        );
        fontFace
          .load()
          .then(function (loadedFace) {
            document.fonts.add(loadedFace);
          })
          .catch(function (e) {
            console.error(e);
          });
        const blob = await font.blob();
        try {
          // eslint-disable-next-line import/no-named-as-default-member
          const fontMeta = opentype.parse(await blob.arrayBuffer());
          return {
            family: fontMeta.names.fontFamily.en,
            fullName: font.fullName,
            style: font.style,
            postscriptName: font.postscriptName,
            meta: fontMeta,
          };
        } catch {
          return {
            family: font.family,
            fullName: font.fullName,
            style: font.style,
            postscriptName: font.postscriptName,
          };
        }
      })
    );
    const sortedFonts = parsedFonts.sort((a, b) => {
      if (a.family < b.family) return -1;
      return 1;
    });

    setFonts(sortedFonts);
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
            {fonts[0].meta && fonts[0].meta.names.fullName.ja && (
              <Text>{fonts[0].meta.names.fullName.ja}</Text>
            )}
          </Box>

          <Tabs defaultValue="info" variant="pills" color="yellow" w="100%">
            <Tabs.List>
              <Tabs.Tab value="info">Info</Tabs.Tab>
              <Tabs.Tab value="variants">Variants</Tabs.Tab>
              <Tabs.Tab value="lab">Lab</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="info" pt="xs">
              {fonts[0].meta ? (
                <>
                  <Select
                    label="ウエイト"
                    placeholder="Pick one"
                    value={index.toString()}
                    data={fonts.map((font, i) => {
                      return { value: i.toString(), label: font.style };
                    })}
                    onChange={(v) => v && setIndex(parseInt(v))}
                    py={10}
                  />
                  <Table>
                    <tbody>
                      {fonts[index] &&
                        fonts[index].meta &&
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        Object.entries(fonts[index].meta!.names).map(
                          ([key, value]) => (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>
                                {value.ja ? (
                                  <>
                                    <Badge
                                      color="yellow"
                                      variant="light"
                                      mr="md"
                                    >
                                      JA
                                    </Badge>
                                    {value.ja}
                                  </>
                                ) : (
                                  value.en
                                )}
                              </td>
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
              <Flex direction="column">
                {fonts.map((font) => (
                  <Box key={font.fullName}>
                    <Title order={3} weight="inherit">
                      {font.fullName}
                    </Title>
                    <Text
                      fz={50}
                      style={{
                        fontFamily: `'${font.fullName}', Tofu`,
                      }}
                    >
                      {text}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Tabs.Panel>
            <Tabs.Panel value="lab" pt="xs">
              <Lab
                fontFamily={`'${
                  fonts[0].meta
                    ? fonts[0].meta.names.fontFamily.en
                    : fonts[0].family
                }', Tofu`}
              />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FontPage;
