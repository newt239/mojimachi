import { useEffect, useState } from "react";
import { Link as ReactLink, useParams } from "react-router-dom";

import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { ArrowUUpLeftIcon } from "@phosphor-icons/react";
import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";

import { previewStringAtom } from "#/utils/jotai";

import type { FontInfo } from "#/types/font";

export const FamilyPage: React.FC = () => {
  const { family_name } = useParams();
  const previewString = useAtomValue(previewStringAtom);
  const [styles, setStyles] = useState<FontInfo[]>([]);

  useEffect(() => {
    let cancelled = false;

    const getFontNameList = async () => {
      const fonts: FontInfo[] = await invoke("get_fonts_by_family", {
        family: family_name,
      });
      for (const font of fonts) {
        const source = `local('${font.postscript_name}')`;
        const fontFace = new FontFace(font.postscript_name, source);
        fontFace
          .load()
          .then((loadedFace) => {
            document.fonts.add(loadedFace);
          })
          .catch((error: unknown) => {
            console.error(error);
          });
      }
      if (!cancelled) {
        setStyles(fonts);
      }
    };

    void getFontNameList();

    return () => {
      cancelled = true;
    };
  }, [family_name]);

  return (
    <Box p="1rem">
      <Button
        as={ReactLink}
        to="/"
        variant="ghost"
        colorScheme="purple"
        leftIcon={<ArrowUUpLeftIcon size="1.5rem" weight="duotone" />}
      >
        戻る
      </Button>
      <Heading as="h2" size="2xl">
        {family_name}
      </Heading>
      <Stack mt={5}>
        {styles.map((style) => (
          <Flex key={style.postscript_name} flexDirection="column">
            <Link
              as={ReactLink}
              to={`/family/${family_name}/font/${style.postscript_name}`}
              sx={{
                _hover: {
                  color: "purple.500",
                },
                transition: "all ease 0.2s",
              }}
            >
              {style.postscript_name}
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
