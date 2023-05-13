import { Box, Button, Center, Grid, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useAtom, useAtomValue } from "jotai";
import { ArrowClockwise, Play } from "phosphor-react";

import FontCard from "~/components/FontCard";
import { fontListAtom, fontNameListAtom, pinnedFontsAtom } from "~/jotai/atoms";
import { FontData } from "~/types/FontData";

const FontList: React.FC<{ pinned?: boolean }> = ({ pinned = false }) => {
  const pinnedFonts = useAtomValue(pinnedFontsAtom);
  const [fontList, setFontList] = useAtom(fontListAtom);
  const [fontNameList, setFontNameList] = useAtom(fontNameListAtom);
  const [visible, handlers] = useDisclosure(false);

  const logFontData = async () => {
    handlers.open();
    setFontList([]);
    setFontNameList([]);
    try {
      const availableFonts: FontData[] = await window.queryLocalFonts();
      if (pinned) {
        setFontList(
          availableFonts.filter((font) => pinnedFonts.includes(font.family))
        );
        setFontNameList(pinnedFonts);
        return;
      } else {
        setFontList(availableFonts);
        setFontNameList([
          ...new Set(availableFonts.map((font) => font.family)),
        ]);
      }
    } catch (err) {
      alert(err);
    }
    handlers.close();
  };

  return (
    <Box>
      <LoadingOverlay
        visible={visible}
        overlayBlur={2}
        loaderProps={{ size: "lg", color: "yellow" }}
      />
      {fontNameList.length === 0 ? (
        <Center>
          <Button
            color="yellow"
            onClick={logFontData}
            leftIcon={<Play size={20} />}
          >
            フォントを取得
          </Button>
        </Center>
      ) : (
        <>
          <Box ta="end" mx={5}>
            <Button
              color="yellow"
              onClick={logFontData}
              leftIcon={<ArrowClockwise size="20" />}
            >
              フォントを再取得
            </Button>
          </Box>
          <Grid m={5}>
            {fontNameList.map((fontName) => {
              const fontData = fontList.find(
                (font) => font.family === fontName
              ) as FontData;
              return (
                <Grid.Col lg={3} md={4} sm={6} xs={12} key={fontName}>
                  <FontCard key={fontName} family={fontData.family} />
                </Grid.Col>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default FontList;
