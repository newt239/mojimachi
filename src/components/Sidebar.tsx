import { Link as ReactLink, useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  List,
  Stack,
  Switch,
  Text,
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
      sx={{
        display: "block",
        position: "fixed",
        top: "4rem",
        right: 0,
        height: "calc(100vh - 4rem)",
        width: "15rem",
        bgColor: "purple.50",
        _dark: {
          bgColor: "gray.900",
        },
      }}
      zIndex={50}
    >
      <Stack gap="2rem" px="1rem" py="0.5rem">
        <Box>
          <Button
            w="full"
            colorScheme="purple"
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
              colorScheme="purple"
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
          <List py={2}>
            {favoriteFamily.map((family_name) => (
              <Link
                aria-current={
                  location.pathname.startsWith(`/family/${family_name}`)
                    ? "page"
                    : undefined
                }
                as={ReactLink}
                to={`/family/${family_name}`}
                key={family_name}
                sx={{
                  display: "block",
                  w: "full",
                  px: 4,
                  py: 2,
                  textDecoration: "none",
                  borderRadius: "lg",
                  transition: "all 0.2s ease-in-out",
                  _hover: {
                    textDecoration: "none",
                    bgColor: "purple.100",
                    color: "purple.500",
                  },
                  _activeLink: {
                    bgColor: "purple.100",
                    color: "purple.500",
                  },
                }}
              >
                {family_name}
              </Link>
            ))}
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export default Sidebar;
