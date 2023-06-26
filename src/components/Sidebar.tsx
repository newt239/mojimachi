import { Link as ReactLink } from "react-router-dom";

import {
  Box,
  Button,
  Heading,
  List,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import { favoriteFamilyAtom } from "~/utils/jotai";

const Sidebar: React.FC = () => {
  const favoriteFamily = useAtomValue(favoriteFamilyAtom);

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      w="15rem"
      display="block"
      sx={{
        position: "sticky",
        top: "3rem",
        left: 0,
        height: "calc(100vh - 3rem)",
      }}
    >
      <Stack gap="2rem" px="1rem" py="3rem">
        <Box>
          <Heading as="h4" size="xs" fontWeight="bold">
            フィルター
          </Heading>
        </Box>
        <Box>
          <ReactLink to="/favorite">
            <Heading as="h4" size="xs" fontWeight="bold">
              お気に入り
            </Heading>
          </ReactLink>
          <List>
            {favoriteFamily.map((family_name) => (
              <Button
                as={ReactLink}
                to={`/family/${family_name}`}
                key={family_name}
                variant="link"
                colorScheme="orange"
                size="sm"
                w="100%"
                justifyContent="flex-start"
                pt={3}
                pl={3}
              >
                {family_name}
              </Button>
            ))}
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export default Sidebar;
