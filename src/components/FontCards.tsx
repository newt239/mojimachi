import { useEffect } from "react";

import { Spacer, Stack } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useAtomValue } from "jotai";

import FontCard from "./FontCard";

import { FontInfo } from "~/types/FontData";
import { displayModeAtom } from "~/utils/jotai";

type EachFontProps = {
  familyList: FontInfo[];
};

const FontCards: React.FC<EachFontProps> = ({ familyList }) => {
  const displayMode = useAtomValue(displayModeAtom);

  useEffect(() => {
    familyList.map(async (family) => {
      const font_name = family.font_path.split("Microsoft\\Windows\\Fonts")[1];
      if (font_name) {
        const font_bytes: number[] = await invoke("get_file_as_byte_vec", {
          filename: family.font_path,
        });
        const font_blob = new Blob([new Uint8Array(font_bytes)], {
          type: "font/opentype",
        });
        const reader = new FileReader();
        reader.readAsDataURL(font_blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const fontFace = new FontFace(
            family.family_name,
            `url(${base64data})`
          );
          fontFace
            .load()
            .then((loadedFace) => {
              document.fonts.add(loadedFace);
            })
            .catch((e) => {
              console.error(e);
            });
        };
      }
    });
  }, []);

  if (familyList.length === 0)
    return <>条件に合うフォントが見つかりませんでした。</>;

  return (
    <Stack
      gap="0.5rem"
      direction={displayMode === "vertical" ? "row" : "column"}
    >
      {familyList.map((family, i) => (
        <FontCard key={i} family_name={family.family_name} />
      ))}
      <Spacer w="1rem" h="1rem" />
    </Stack>
  );
};

export default FontCards;
