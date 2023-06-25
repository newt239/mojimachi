import { Link, useParams } from "react-router-dom";

import {
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
    <>
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
      <Tabs mt={5}>
        <TabList>
          <Tab>Info</Tab>
          <Tab>Styles</Tab>
          <Tab>Glyphs</Tab>
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
        </TabPanels>
      </Tabs>
    </>
  );
};

export default FamilyPage;
