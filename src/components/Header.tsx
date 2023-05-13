import { Link } from "react-router-dom";

import { ActionIcon, Flex, Header as MantineHeader } from "@mantine/core";

import { GithubLogo } from "phosphor-react";

const Header: React.FC = () => {
  return (
    <MantineHeader height={60} p="xs">
      <Flex align="center" h="100%" justify="space-between" px="lg">
        <Link to="/">
          <h1>Local Font Emulator</h1>
        </Link>
        <ActionIcon
          component="a"
          href="https://github.com/newt239/local-font-emulator"
          variant="outline"
          target="default"
          size="lg"
        >
          <GithubLogo size={32} />
        </ActionIcon>
      </Flex>
    </MantineHeader>
  );
};

export default Header;
