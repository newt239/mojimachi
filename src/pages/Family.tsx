import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { ArrowUUpLeft } from "@phosphor-icons/react";
import { invoke } from "@tauri-apps/api";
import { useAtomValue } from "jotai";

import { fontSizeAtom, previewStringAtom } from "~/utils/jotai";

const FamilyPage: React.FC = () => {
  const { family_name } = useParams();
  const previewString = useAtomValue(previewStringAtom);
  const fontSize = useAtomValue(fontSizeAtom);
  const [styles, setStyles] = useState<string[]>([]);

  const getFontNameList = async () => {
    const fontNameList: string[] = await invoke("get_fonts_by_family", {
      family: family_name,
    });
    for (const style of fontNameList) {
      const fontFace = new FontFace(style, `local('${style}')`);
      fontFace
        .load()
        .then(function (loadedFace) {
          document.fonts.add(loadedFace);
        })
        .catch(function (e) {
          console.error(e);
        });
    }
    setStyles(fontNameList);
  };

  useEffect(() => {
    getFontNameList();
  }, []);

  return (
    <Box p="1rem">
      <Button
        as={Link}
        to="/"
        variant="ghost"
        colorScheme="orange"
        leftIcon={<ArrowUUpLeft size="1.5rem" weight="duotone" />}
      >
        戻る
      </Button>
      <Heading as="h2" size="2xl">
        {family_name}
      </Heading>
      <Stack mt={5}>
        {styles.map((style) => (
          <Flex key={style} flexDirection="column">
            <Link to={`/font/${style}`}>
              <Text>{style}</Text>
            </Link>
            <Text
              ml={2}
              sx={{
                fontFamily: `'${style}', Tofu`,
                fontSize: `${fontSize}px`,
              }}
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
