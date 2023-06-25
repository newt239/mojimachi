import { Link } from "react-router-dom";

import { Box, Flex, Switch, Text } from "@chakra-ui/react";

type EachFontProps = {
  family_name: string;
};

const EachFont: React.FC<EachFontProps> = ({ family_name }) => {
  return (
    <Box>
      <Flex align="center" justify="space-between">
        <Link to={`/family/${family_name}`}>{family_name}</Link>
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
    </Box>
  );
};

export default EachFont;
