import { Link } from "react-router-dom";

import { Card, Flex, Switch, Text } from "@chakra-ui/react";

import { FontList } from "~/types/FontData";

type FontCardProps = {
  font: FontList[number];
};

const FontPreview: React.FC<FontCardProps> = ({ font }) => {
  return (
    <Card shadow="xs" p="md" w="100%">
      <Flex align="center" justify="space-between">
        <Link to={`/font/${font.family}`}>
          <p>{font.family}</p>
        </Link>
        <Switch color="yellow" />
      </Flex>
      <Text></Text>
    </Card>
  );
};

export default FontPreview;
