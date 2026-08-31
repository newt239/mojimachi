import { Link, useParams } from "react-router-dom";

import {
  Box,
  HStack,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ArrowUUpLeftIcon } from "@phosphor-icons/react";

import { Glyphs } from "#/components/glyphs";
import { Info } from "#/components/info";
import { Playground } from "#/components/playground";

export const FontPage: React.FC = () => {
  const { family_name, font_name } = useParams();

  if (!font_name) {
    return null;
  }

  return (
    <Box p="1rem">
      <HStack gap={3} alignItems="center">
        <IconButton
          aria-label="戻る"
          as={Link}
          to={`/family/${family_name}`}
          variant="ghost"
          colorScheme="purple"
          size="lg"
        >
          <ArrowUUpLeftIcon size="1.5rem" weight="duotone" />
        </IconButton>
        <Heading as="h2" fontSize="3rem" lineHeight="3rem">
          {font_name}
        </Heading>
      </HStack>
      <Tabs mt={5} colorScheme="purple">
        <TabList>
          <Tab>情報</Tab>
          <Tab>グリフ一覧</Tab>
          <Tab>ためしがき</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Info font_name={font_name} />
          </TabPanel>
          <TabPanel>
            <Glyphs font_name={font_name} />
          </TabPanel>
          <TabPanel>
            <Playground font_name={font_name} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
