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

const FamilyPage: React.FC = () => {
  const { family_name } = useParams();

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
            <p>two!</p>
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
