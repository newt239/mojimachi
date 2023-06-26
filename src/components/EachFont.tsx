import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";

import { favoriteFamilyAtom, fontSizeAtom } from "~/utils/jotai";

type EachFontProps = {
  family_name: string;
};

const EachFont: React.FC<EachFontProps> = ({ family_name }) => {
  const fontSize = useAtomValue(fontSizeAtom);
  const [favoriteFamily, setFavoriteFamily] = useAtom(favoriteFamilyAtom);

  const onChange = (_e: ChangeEvent<HTMLInputElement>) => {
    if (favoriteFamily.includes(family_name)) {
      setFavoriteFamily(favoriteFamily.filter((f) => f !== family_name));
    } else {
      setFavoriteFamily([...favoriteFamily, family_name]);
    }
  };

  return (
    <Box>
      <Flex align="center" justify="space-between">
        <Link to={`/family/${family_name}`}>{family_name}</Link>
        <Switch
          colorScheme="orange"
          onChange={onChange}
          isChecked={favoriteFamily.includes(family_name)}
        />
      </Flex>
      <Text
        sx={{
          fontFamily: `'${family_name}', Tofu`,
          fontSize: `${fontSize}px`,
          lineHeight: `${fontSize}px`,
        }}
      >
        にほんごどう？
      </Text>
    </Box>
  );
};

export default EachFont;
