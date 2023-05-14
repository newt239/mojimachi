import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ActionIcon,
  Anchor,
  Flex,
  Navbar,
  SegmentedControl,
  Slider,
  Text,
  Textarea,
  Title,
} from "@mantine/core";

import { GithubLogo } from "@phosphor-icons/react";
import { useAtom } from "jotai";

import { fontSizeAtom, textAtom } from "~/jotai/atoms";

export function SideBar() {
  const { search, pathname } = useLocation();
  const query = new URLSearchParams(search);
  const navigate = useNavigate();

  const [text, setText] = useAtom(textAtom);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);

  return (
    <Navbar width={{ sm: 300 }} p="md">
      <Navbar.Section mb="md">
        <Link to="/">
          <Title
            color="yellow"
            order={1}
            sx={{
              lineHeight: 1,
              transition: "color 0.2s ease",
              ":hover": {
                color: "black",
              },
            }}
          >
            Local Font Emulator
          </Title>
        </Link>
      </Navbar.Section>

      <Textarea
        placeholder="Type something..."
        mb="sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Navbar.Section grow>
        <Text size="xs" weight={500} color="dimmed" my="xs">
          フォントサイズ
        </Text>
        <Slider value={fontSize} onChange={setFontSize} min={5} max={50} />
        <Text size="xs" weight={500} color="dimmed" my="xs">
          フィルター
        </Text>
        <SegmentedControl
          disabled={pathname.includes("font")}
          data={[
            { value: "all", label: "すべて" },
            { value: "pinned", label: "お気に入り" },
          ]}
          onChange={(value) => {
            if (value === "all") {
              query.delete("pinned");
              navigate({ search: query.toString() });
            } else if (value === "pinned") {
              query.set("pinned", "true");
              navigate({ search: query.toString() });
            }
          }}
          fullWidth
        />

        <Text size="xs" weight={500} color="dimmed" my="xs">
          和文フォント
        </Text>
        <SegmentedControl
          disabled={pathname.includes("font")}
          data={[
            { value: "all", label: "すべて" },
            { value: "ja", label: "和文のみ" },
          ]}
          onChange={(value) => {
            if (value === "all") {
              query.delete("ja");
              navigate({ search: query.toString() });
            } else if (value === "ja") {
              query.set("ja", "true");
              navigate({ search: query.toString() });
            }
          }}
          fullWidth
        />
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
            variant="subtle"
            target="default"
            color="dark"
            size="lg"
          >
            <GithubLogo size={20} />
          </ActionIcon>
        </Flex>
      </Navbar.Section>
    </Navbar>
  );
}
