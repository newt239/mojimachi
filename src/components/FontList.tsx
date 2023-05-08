import { Button } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { pinnedFontsAtom } from "../jotai/atoms";
import { FontData } from "../types/FontData";
import FontCard from "./FontCard";
import classes from "./FontList.module.css";

const FontList: React.FC<{ pinned?: boolean }> = ({ pinned = false }) => {
  const pinnedFonts = useAtomValue(pinnedFontsAtom);
  const [fontList, setFontList] = useState<FontData[]>([]);
  const [fontNameList, setFontNameList] = useState<string[]>([]);

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
        <div className={classes.cardGrid}>
          {fontNameList.map((fontName) => {
            const fontData = fontList.find(
              (font) => font.family === fontName
            ) as FontData;
            return <FontCard key={fontName} family={fontData.family} />;
          })}
        </div>
      )}
    </>
  );
};

export default FontList;
