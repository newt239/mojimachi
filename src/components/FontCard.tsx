import { useAtom, useAtomValue } from "jotai";
import { pinnedFontsAtom, textAtom } from "../jotai/atoms";
import classes from "./FontCard.module.css";

type FontCardProps = {
  family: string;
  fullName: string;
};

const FontCard: React.FC<FontCardProps> = ({ family, fullName }) => {
  const text = useAtomValue(textAtom);
  const [pinnedFonts, setPinnedFonts] = useAtom(pinnedFontsAtom);

  return (
    <div key={fullName} className={classes.fontCard}>
      <div className={classes.fontInfo}>
        <p className={classes.fontName}>{family}</p>
        <input
          className={classes.togglePinned}
          type="checkbox"
          checked={pinnedFonts.includes(family)}
          onChange={(e) => {
            if (e.target.checked) {
              setPinnedFonts([...pinnedFonts, family]);
            } else {
              setPinnedFonts(pinnedFonts.filter((font) => font !== family));
            }
          }}
        />
      </div>
      <p
        className={classes.fontText}
        style={{
          fontFamily: family,
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default FontCard;
