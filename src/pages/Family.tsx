import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { ArrowUUpLeft } from "@phosphor-icons/react";
import { invoke } from "@tauri-apps/api";

const FamilyPage: React.FC = () => {
  const { family_name } = useParams();
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
      <Tabs mt={5} colorScheme="orange">
        <TabList>
          <Tab>Info</Tab>
          <Tab>Styles</Tab>
          <Tab>Glyphs</Tab>
          <Tab>Playground</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <Stack>
              {styles.map((style) => (
                <Text key={style} sx={{ fontFamily: `'${style}', Tofu` }}>
                  {style}
                </Text>
              ))}
            </Stack>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FamilyPage;
