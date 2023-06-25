import {
  Box,
  Button,
  Flex,
  Heading,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Moon, Sun } from "@phosphor-icons/react";

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <header
      style={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 10 }}
    >
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Heading as="h1" size="xl">
            Local Font Emulator
          </Heading>

          <Flex alignItems={"center"}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? (
                <Moon weight="duotone" />
              ) : (
                <Sun weight="duotone" />
              )}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </header>
  );
};

export default Header;
