import { useAtom, useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { pinnedFontsAtom, textAtom } from "../jotai/atoms";
import classes from "./SideBar.module.css";

const SideBar: React.FC = () => {
  const [text, setText] = useAtom(textAtom);
  const pinnedFonts = useAtomValue(pinnedFontsAtom);

  return (
    <div className={classes.sideBar}>
      <input
        className={classes.textInput}
        type="text"
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
    </div>
  );
};

export default SideBar;
