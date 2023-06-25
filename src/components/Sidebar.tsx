import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

const Sidebar: React.FC = () => {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      w={100}
      display="block"
      sx={{
        position: "sticky",
        top: "3rem",
        left: 0,
        height: "calc(100vh - 3rem)",
      }}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        Logo
      </Flex>
    </Box>
  );
};

export default Sidebar;
