import { Link, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ArrowUUpLeft } from "@phosphor-icons/react";

import Glyphs from "~/components/Glyphs";
import Info from "~/components/Info";
import Playground from "~/components/Playground";

const FontPage: React.FC = () => {
  const { family_name, font_name } = useParams();

  if (!font_name) return null;

  return (
    <Box p="1rem">
      <Button
        as={Link}
        to={`/family/${family_name}`}
        variant="ghost"
        colorScheme="purple"
        leftIcon={<ArrowUUpLeft size="1.5rem" weight="duotone" />}
      >
        戻る
      </Button>
      <Heading as="h2" size="2xl">
        {font_name}
      </Heading>
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

export default FontPage;
