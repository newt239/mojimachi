import { Link } from "react-router-dom";

import { Card, Flex, Switch, Text } from "@chakra-ui/react";

type EachFontProps = {
  family_name: string;
};

const EachFont: React.FC<EachFontProps> = ({ family_name }) => {
  return (
    <Card shadow="xs" p="md" w="100%">
      <Flex align="center" justify="space-between">
        <Link to={`/font/${family_name}`}>
          <p>{family_name}</p>
        </Link>
        <Switch color="yellow" />
      </Flex>
      <Text
        sx={{
          fontFamily: `'${family_name}', Tofu`,
          fontSize: "30px",
          lineHeight: "30px",
        }}
      >
        にほんごどう？
      </Text>
    </Card>
  );
};

export default EachFont;
