import { Paper, Switch } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { Link } from "react-router-dom";
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
    <Paper shadow="xs" p="md" w={300}>
      <div className={classes.fontInfo}>
        <Link to={`/font/${family}`}>
          <p className={classes.fontName}>{family}</p>
        </Link>
        <Switch
          color="orange"
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
    </Paper>
  );
};

export default FontCard;
