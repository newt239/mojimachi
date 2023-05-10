import { Link } from "react-router-dom";

import {
  ActionIcon,
  Burger,
  Flex,
  Header as MantineHeader,
  MediaQuery,
} from "@mantine/core";

import { useAtom } from "jotai";
import { GithubLogo } from "phosphor-react";

import { openedAtom } from "~/jotai/atoms";

import classes from "./Header.module.css";

const Header: React.FC = () => {
  const [opened, setOpened] = useAtom(openedAtom);

  return (
    <MantineHeader height={60} p="xs">
      <Flex align="center" h="100%" justify="space-between" px="lg">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>
        <Link to="/">
          <h1 className={classes.siteName}>Local Font Emulator</h1>
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
