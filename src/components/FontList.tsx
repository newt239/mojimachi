import { Button, Grid } from "@mantine/core";

import { useAtom, useAtomValue } from "jotai";

import { fontListAtom, fontNameListAtom, pinnedFontsAtom } from "~/jotai/atoms";
import { FontData } from "~/types/FontData";

import FontCard from "./FontCard";

const FontList: React.FC<{ pinned?: boolean }> = ({ pinned = false }) => {
  const pinnedFonts = useAtomValue(pinnedFontsAtom);
  const [fontList, setFontList] = useAtom(fontListAtom);
  const [fontNameList, setFontNameList] = useAtom(fontNameListAtom);

  const logFontData = async () => {
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
      console.error(err);
    }
  };

  return (
    <>
      {fontNameList.length === 0 ? (
        <Button color="orange" onClick={logFontData}>
          Get Font List
        </Button>
      ) : (
        <Grid m={4}>
          {fontNameList.map((fontName) => {
            const fontData = fontList.find(
              (font) => font.family === fontName
            ) as FontData;
            return (
              <Grid.Col lg={3} md={4} sm={6} xs={12}>
                <FontCard key={fontName} family={fontData.family} />
              </Grid.Col>
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default FontList;
