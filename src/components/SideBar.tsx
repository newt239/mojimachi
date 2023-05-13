import { Link } from "react-router-dom";

import { Box, List, Navbar, Textarea } from "@mantine/core";

import { useAtom, useAtomValue } from "jotai";

import { pinnedFontsAtom, textAtom } from "~/jotai/atoms";

const SideBar: React.FC = () => {
  const [text, setText] = useAtom(textAtom);
  const pinnedFonts = useAtomValue(pinnedFontsAtom);

  return (
    <Navbar hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }} p="sm">
      <Navbar.Section grow>
        <Textarea
          label="表示するテキスト"
          autosize
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {pinnedFonts.length > 0 && (
          <Box mt={10}>
            <Link to="/pinned">Pinned Fonts</Link>
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
    </Navbar>
  );
};

export default SideBar;
