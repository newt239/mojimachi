import { Link } from "react-router-dom";

import { Flex, Paper, ScrollArea, Switch, Text } from "@mantine/core";

import { useAtom, useAtomValue } from "jotai";

import { pinnedFontsAtom, textAtom } from "~/jotai/atoms";

type FontCardProps = {
  family: string;
};

const FontCard: React.FC<FontCardProps> = ({ family }) => {
  const text = useAtomValue(textAtom);
  const [pinnedFonts, setPinnedFonts] = useAtom(pinnedFontsAtom);

  return (
    <Paper shadow="xs" p="md" w="100%">
      <Flex align="center" justify="space-between">
        <Link to={`/font/${family}`}>
          <p>{family}</p>
        </Link>
        <Switch
          color="orange"
          checked={pinnedFonts.includes(family)}
          onChange={(e) => {
            if (e.target.checked) {
              setPinnedFonts([...pinnedFonts, family]);
            } else {
              setPinnedFonts(pinnedFonts.filter((font) => font !== family));
            }
          }}
        />
      </Flex>
      <ScrollArea h="20vh" w="100%" offsetScrollbars>
        <Text
          fz="lg"
          sx={{ whiteSpace: "pre-wrap" }}
          style={{
            fontFamily: family,
          }}
        >
          {text}
        </Text>
      </ScrollArea>
    </Paper>
  );
};

export default FontCard;
