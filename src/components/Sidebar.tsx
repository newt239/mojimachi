import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";

const Sidebar: React.FC = () => {
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
          <Heading as="h4" size="xs" fontWeight="bold">
            お気に入り
          </Heading>
        </Box>
      </Stack>
    </Box>
  );
};

export default Sidebar;
