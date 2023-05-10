import { Link } from "react-router-dom";

import { Burger, Header as MantineHeader, MediaQuery } from "@mantine/core";

import { useAtom } from "jotai";

import { openedAtom } from "~/jotai/atoms";

import classes from "./Header.module.css";

const Header: React.FC = () => {
  const [opened, setOpened] = useAtom(openedAtom);

  return (
    <MantineHeader height={60} p="xs">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
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
      </div>
    </MantineHeader>
  );
};

export default Header;
