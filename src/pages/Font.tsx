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

const FontPage: React.FC = () => {
  const { font_name } = useParams();

  if (!font_name) return null;

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
        {font_name}
      </Heading>
      <Tabs mt={5} colorScheme="orange">
        <TabList>
          <Tab>Info</Tab>
          <Tab>Glyphs</Tab>
          <Tab>Playground</Tab>
        </TabList>
        <TabPanels>
          <TabPanel sx={{ fontFamily: `'${font_name}', Tofu` }}></TabPanel>
          <TabPanel>
            <Glyphs font_name={font_name} />
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FontPage;
