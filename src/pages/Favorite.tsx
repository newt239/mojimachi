import { Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import EachFont from "~/components/EachFont";
import { favoriteFamilyAtom } from "~/utils/jotai";

const FavoritePage: React.FC = () => {
  const favoriteFamily = useAtomValue(favoriteFamilyAtom);

  return (
    <Stack gap="0.5rem">
      {favoriteFamily.map((family) => (
        <EachFont key={family} family_name={family} />
      ))}
    </Stack>
  );
};

export default FavoritePage;
