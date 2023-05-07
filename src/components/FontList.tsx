import { useEffect, useState } from "react";
import { FontData } from "../types/FontData";
import FontCard from "./FontCard";
import classes from "./FontList.module.css";

const FontList: React.FC = () => {
  const [fontList, setFontList] = useState<FontData[]>([]);
  const [fontNameList, setFontNameList] = useState<string[]>([]);

  const logFontData = async () => {
    setFontList([]);
    setFontNameList([]);
    try {
      const availableFonts: FontData[] = await window.queryLocalFonts();
      setFontList(availableFonts);
      setFontNameList([...new Set(availableFonts.map((font) => font.family))]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    logFontData();
  }, []);

  return (
    <>
      <button onClick={logFontData}>Get Font List</button>
      <div className={classes.cardGrid}>
        {fontNameList.map((fontName) => {
          const fontData = fontList.find(
            (font) => font.family === fontName
          ) as FontData;
          return (
            <FontCard
              key={fontName}
              family={fontData.family}
              fullName={fontData.fullName}
            />
          );
        })}
      </div>
    </>
  );
};

export default FontList;
