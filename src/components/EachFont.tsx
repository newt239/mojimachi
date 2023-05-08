import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FontData } from "../types/FontData";

const EachFont: React.FC = () => {
  const { fontFamily } = useParams();
  const [fonts, setFonts] = useState<FontData[]>([]);

  const loadFontData = async () => {
    if (!fontFamily) return;
    const availableFonts: FontData[] = await window.queryLocalFonts({
      families: [fontFamily],
    });
    const filledFonts = availableFonts.filter((font) =>
      font.family.includes(fontFamily)
    );
    console.log(filledFonts);
    setFonts(filledFonts);
  };

  useEffect(() => {
    loadFontData();
  }, [fontFamily]);

  return (
    <div>
      {fonts.length > 0 && (
        <>
          <h2>{fonts[0].family}</h2>
          <ul>
            {fonts.map((font) => (
              <li key={font.fullName} style={{ fontFamily: font.fullName }}>
                {font.fullName}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EachFont;
