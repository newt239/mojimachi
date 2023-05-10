import { Box, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { textAtom } from "~/jotai/atoms";

import { FontData } from "~/types/FontData";

const EachFont: React.FC = () => {
  const { fontFamily } = useParams();
  const [fonts, setFonts] = useState<FontData[]>([]);
  const text = useAtomValue(textAtom);

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
          <Title order={2} fz={75} mb={100}>
            {fonts[0].family}
          </Title>

          <Stack>
            {fonts.map((font) => (
              <Box key={font.fullName}>
                <Title order={3}>{font.fullName}</Title>
                <ScrollArea>
                  <Text
                    fz={50}
                    sx={{ whiteSpace: "nowrap" }}
                    style={{
                      fontFamily: font.fullName,
                      fontWeight: font.style,
                    }}
                  >
                    {text}
                  </Text>
                </ScrollArea>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </div>
  );
};

export default EachFont;