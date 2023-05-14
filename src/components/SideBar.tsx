import { Link } from "react-router-dom";

import {
  ActionIcon,
  Anchor,
  Box,
  Flex,
  List,
  Navbar,
  Text,
  Textarea,
  Title,
} from "@mantine/core";

import { useAtom, useAtomValue } from "jotai";
import { GithubLogo } from "phosphor-react";

import { pinnedFontsAtom, textAtom } from "~/jotai/atoms";

const SideBar: React.FC = () => {
  const [text, setText] = useAtom(textAtom);
  const pinnedFonts = useAtomValue(pinnedFontsAtom);

  return (
    <Navbar hiddenBreakpoint="xs" width={{ base: 300 }} p="sm">
      <Navbar.Section mb="xs">
        <Link to="/">
          <Title order={1}>Local Font Emulator</Title>
        </Link>
      </Navbar.Section>
      <Navbar.Section grow>
        <Textarea
          label="表示するテキスト"
          autosize
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {pinnedFonts.length > 0 && (
          <Box mt={10}>
            <Link to="/?pinned=true">Pinned Fonts</Link>
            <List>
              {pinnedFonts.map((font) => (
                <List.Item key={font}>
                  <Link to={`/font/${font}`}>{font}</Link>
                </List.Item>
              ))}
            </List>
          </Box>
        )}
      </Navbar.Section>
      <Navbar.Section>
        <Flex justify="space-between" align="center">
          <Text>
            © 2023{" "}
            <Anchor href="https://twitter.com/newt239" target="_blank">
              newt239
            </Anchor>
          </Text>
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
      </Navbar.Section>
    </Navbar>
  );
};

export default SideBar;
