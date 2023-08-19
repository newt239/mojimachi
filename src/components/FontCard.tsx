import { ChangeEvent } from "react";
import { Link as ReactLink } from "react-router-dom";

import { Box, Checkbox, Flex, Link, Text } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";

import {
  displayModeAtom,
  favoriteFamiliesAtom,
  previewStringAtom,
} from "~/utils/jotai";

type EachFontProps = {
  family_name: string;
};

const FontCard: React.FC<EachFontProps> = ({ family_name }) => {
  const previewString = useAtomValue(previewStringAtom);
  const displayMode = useAtomValue(displayModeAtom);
  const [favoriteFamily, setFavoriteFamily] = useAtom(favoriteFamiliesAtom);

  const onChange = (_e: ChangeEvent<HTMLInputElement>) => {
    if (favoriteFamily.includes(family_name)) {
      setFavoriteFamily(favoriteFamily.filter((f) => f !== family_name));
    } else {
      setFavoriteFamily([...favoriteFamily, family_name]);
    }
  };

  return (
    <Flex
      flexDirection="column"
      sx={{
        writingMode:
          displayMode === "vertical" ? "vertical-rl" : "horizontal-tb",
      }}
      gap="0.5rem"
    >
      <Flex
        align="center"
        justify="start"
        gap="1rem"
        pb="0.5rem"
        fontSize="sm"
        lineHeight="initial"
      >
        <Checkbox
          colorScheme="purple"
          onChange={onChange}
          isChecked={favoriteFamily.includes(family_name)}
        />
        <Link
          as={ReactLink}
          to={`/family/${family_name}`}
          sx={{
            transition: "all ease 0.2s",
            _hover: {
              color: "purple.500",
            },
          }}
        >
          {family_name}
        </Link>
      </Flex>
      <Box sx={{ contentVisibility: "auto" }}>
        <Text
          fontFamily={`'${family_name}', Tofu`}
          whiteSpace="nowrap"
          fontSize="var(--font-size)"
          overflow="hidden"
        >
          {previewString}
        </Text>
      </Box>
    </Flex>
  );
};

export default FontCard;
