import { useState } from "react";
import { FontData } from "../types/FontData";

const FontList: React.FC<{ text: string }> = ({ text }) => {
  const [fontList, setFontList] = useState<FontData[]>([]);

  const logFontData = async () => {
    try {
      const availableFonts: FontData[] = await window.queryLocalFonts();
      setFontList(availableFonts);
      for (const fontData of availableFonts) {
        console.log(fontData.postscriptName);
        console.log(fontData.fullName);
        console.log(fontData.family);
        console.log(fontData.style);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button onClick={logFontData}>Get Font List</button>
      {fontList.map((fontData) => (
        <div
          key={fontData.postscriptName}
          style={{
            fontFamily: fontData.family,
            fontWeight: fontData.style,
            border: "1px solid white",
          }}
        >
          <p>{fontData.postscriptName}</p>
          <p>{fontData.fullName}</p>
          <p>{fontData.family}</p>
          <p>{fontData.style}</p>
          <p>{text}</p>
        </div>
      ))}
    </>
  );
};

export default FontList;
