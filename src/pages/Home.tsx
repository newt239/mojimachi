import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { Box, Button, Center, Grid, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { ArrowClockwise, Play } from "@phosphor-icons/react";
import { useAtom, useAtomValue } from "jotai";

import FontCard from "~/components/FontCard";
import { fontListAtom, fontNameListAtom, pinnedFontsAtom } from "~/jotai/atoms";
import { FontData } from "~/types/FontData";

const HomePage: React.FC = () => {
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const pinnedFonts = useAtomValue(pinnedFontsAtom);
  const [fontList, setFontList] = useAtom(fontListAtom);
  const [fontNameList, setFontNameList] = useAtom(fontNameListAtom);
  const [visible, handlers] = useDisclosure(false);

  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    } else {
      logFontData();
    }
  }, [search]);

  const logFontData = async () => {
    handlers.open();
    setFontList([]);
    setFontNameList([]);
    try {
      const availableFonts: FontData[] = await window.queryLocalFonts();
      if (query.get("pinned") === "true") {
        setFontList(
          availableFonts.filter((font) => pinnedFonts.includes(font.family))
        );
        setFontNameList(pinnedFonts);
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

export default HomePage;
