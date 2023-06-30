import { Link as ReactLink, useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";

import {
  familyKeywordAtom,
  favoriteFamiliesAtom,
  jaFilterAtom,
} from "~/utils/jotai";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const favoriteFamily = useAtomValue(favoriteFamiliesAtom);
  const [jaFilter, setJaFilter] = useAtom(jaFilterAtom);
  const [familyKeyword, setFamilyKeyword] = useAtom(familyKeywordAtom);

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      w="20%"
      display="block"
      sx={{
        position: "sticky",
        top: "4rem",
        left: 0,
        height: "calc(100vh - 4rem)",
      }}
    >
      <Stack gap="2rem" px="1rem">
        <Box>
          <Button
            w="full"
            colorScheme="orange"
            onClick={() => {
              setJaFilter(false);
              setFamilyKeyword("");
              navigate("/");
            }}
            isDisabled={
              !jaFilter && location.pathname === "/" && familyKeyword === ""
            }
          >
            すべて表示
          </Button>
        </Box>
        <Box>
          <Heading as="h4" size="xs" fontWeight="bold">
            フィルター
          </Heading>
          <Flex pt={3} alignItems="center" gap={1}>
            <Switch
              colorScheme="orange"
              onChange={() => setJaFilter((v) => !v)}
              isChecked={jaFilter}
            />
            <Text>日本語のみ</Text>
          </Flex>
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
