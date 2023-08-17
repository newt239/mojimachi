import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { ArrowUUpLeft } from "@phosphor-icons/react";
import { invoke } from "@tauri-apps/api";
import { useAtomValue } from "jotai";

import { FontInfo } from "~/types/FontData";
import { previewStringAtom } from "~/utils/jotai";

const FamilyPage: React.FC = () => {
  const { family_name } = useParams();
  const previewString = useAtomValue(previewStringAtom);
  const [styles, setStyles] = useState<FontInfo[]>([]);

  const getFontNameList = async () => {
    const fonts: FontInfo[] = await invoke("get_fonts_by_family", {
      family: family_name,
    });
    for (const font of fonts) {
      const fontFace = new FontFace(
        font.postscript_name,
        `url("http://localhost:1420/@fs/${font.font_path.replaceAll(
          "\\",
          "/"
        )}")`
      );
      fontFace
        .load()
        .then(function (loadedFace) {
          document.fonts.add(loadedFace);
        })
        .catch(function (e) {
          console.error(e);
        });
    }
    setStyles(fonts);
  };

  useEffect(() => {
    getFontNameList();
  }, [family_name]);

  return (
    <Box p="1rem">
      <Button
        as={Link}
        to="/"
        variant="ghost"
        colorScheme="purple"
        leftIcon={<ArrowUUpLeft size="1.5rem" weight="duotone" />}
      >
        戻る
      </Button>
      <Heading as="h2" size="2xl">
        {family_name}
      </Heading>
      <Stack mt={5}>
        {styles.map((style) => (
          <Flex key={style.postscript_name} flexDirection="column">
            <Link to={`/family/${family_name}/font/${style.postscript_name}`}>
              <Text>{style.postscript_name}</Text>
            </Link>
            <Text
              ml={2}
              fontFamily={`'${style.postscript_name}', Tofu`}
              fontSize="var(--font-size)"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              {previewString}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default FamilyPage;
