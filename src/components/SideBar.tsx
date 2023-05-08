import { Navbar, Textarea } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { openedAtom, pinnedFontsAtom, textAtom } from "../jotai/atoms";
import classes from "./SideBar.module.css";

const SideBar: React.FC = () => {
  const [text, setText] = useAtom(textAtom);
  const pinnedFonts = useAtomValue(pinnedFontsAtom);
  const opened = useAtomValue(openedAtom);

  return (
    <Navbar
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
      p="sm"
    >
      <Textarea
        label="表示するテキスト"
        autosize
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {pinnedFonts.length > 0 && (
        <div className={classes.pinnedFontSection}>
          <Link to="/pinned">
            <h2>Pinned Fonts</h2>
          </Link>
          <ul className={classes.pinnedFontList}>
            {pinnedFonts.map((font) => (
              <li key={font}>{font}</li>
            ))}
          </ul>
        </div>
      )}
    </Navbar>
  );
};

export default SideBar;
