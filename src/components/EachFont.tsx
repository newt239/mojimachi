import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";

import {
  favoriteFamilyAtom,
  fontSizeAtom,
  previewStringAtom,
} from "~/utils/jotai";

type EachFontProps = {
  family_name: string;
};

const EachFont: React.FC<EachFontProps> = ({ family_name }) => {
  const fontSize = useAtomValue(fontSizeAtom);
  const previewString = useAtomValue(previewStringAtom);
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
      <Flex align="center" justify="start" gap="1rem" pb="0.5rem">
        <Switch
          colorScheme="orange"
          onChange={onChange}
          isChecked={favoriteFamily.includes(family_name)}
        />
        <Link to={`/family/${family_name}`}>{family_name}</Link>
      </Flex>
      <Text
        sx={{
          fontFamily: `'${family_name}', Tofu`,
          fontSize: `${fontSize}px`,
          lineHeight: `${fontSize}px`,
        }}
      >
        {previewString}
      </Text>
    </Box>
  );
};

export default EachFont;
