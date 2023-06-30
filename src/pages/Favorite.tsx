import { Box, Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import EachFont from "~/components/EachFont";
import Menubar from "~/components/Menubar";
import { favoriteFamilyAtom, fontSizeAtom } from "~/utils/jotai";

const FavoritePage: React.FC = () => {
  const fontSize = useAtomValue(fontSizeAtom);
  const favoriteFamily = useAtomValue(favoriteFamilyAtom);

  return (
    <>
      <Menubar />
      <Box p="1rem">
        <Stack
          gap="0.5rem"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize}px`,
          }}
        >
          {favoriteFamily.map((family) => (
            <EachFont key={family} family_name={family} />
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default FavoritePage;
