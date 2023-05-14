import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { Box, Button, Center, Grid, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { ArrowClockwise, Play } from "@phosphor-icons/react";
import { useAtom, useAtomValue } from "jotai";
import opentype from "opentype.js";

import FontCard from "~/components/FontCard";
import { fontListAtom, pinnedFontsAtom } from "~/jotai/atoms";
import { FontData, FontList } from "~/types/FontData";

const HomePage: React.FC = () => {
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const pinnedFonts = useAtomValue(pinnedFontsAtom);
  const [fontList, setFontList] = useAtom(fontListAtom);
  const [visible, handlers] = useDisclosure(false);

  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    } else {
      getLocalFonts();
    }
  }, [search]);

  const getLocalFonts = async () => {
    handlers.open();
    setFontList([]);
    try {
      const fonts: FontData[] = await window.queryLocalFonts();
      const uniqueFonts = Array.from(
        new Map(fonts.map((font) => [font.family, font])).values()
      );
      const parsedFonts: FontList = await Promise.all(
        uniqueFonts.map(async (font) => {
          const blob = await font.blob();
          try {
            const fontData = opentype.parse(await blob.arrayBuffer());
            if (fontData.supported) {
              const glyph_あ = fontData.charToGlyphIndex("あ");
              if (glyph_あ !== 0) {
                return {
                  family: font.family,
                  postscriptName: font.postscriptName,
                  ja: "supported",
                };
              }
            }
            return font;
          } catch (err) {
            return {
              family: font.family,
              postscriptName: font.postscriptName,
              ja: "undetermind",
            };
          }
        })
      );
      const filteredFonts = parsedFonts.filter((font) => {
        if (
          query.get("pinned") === "true" &&
          !pinnedFonts.includes(font.family)
        ) {
          return false;
        }
        if (query.get("ja") === "true" && !font?.ja) {
          return false;
        }
        return true;
      });
      const sortedFonts = filteredFonts.sort((a, b) => {
        if (a.ja === "supported" && b.ja === "undetermind") return -1;
        if (a.ja === "undetermind" && b.ja === "supported") return 1;
        return 1;
      });
      setFontList(sortedFonts);
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
      {fontList.length === 0 ? (
        <Center>
          <Button
            color="yellow"
            onClick={getLocalFonts}
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
              onClick={getLocalFonts}
              leftIcon={<ArrowClockwise size="20" />}
            >
              フォントを再取得
            </Button>
          </Box>
          <Grid m={5}>
            {fontList.map((font) => (
              <Grid.Col lg={3} md={4} sm={6} xs={12} key={font.family}>
                <FontCard family={font.family} />
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default HomePage;
