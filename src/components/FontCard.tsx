import classes from "./FontCard.module.css";

type FontCardProps = {
  text: string;
  family: string;
  fullName: string;
};

const FontCard: React.FC<FontCardProps> = ({ text, family, fullName }) => {
  return (
    <div key={fullName} className={classes.fontCard}>
      <p className={classes.fontName}>{family}</p>
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
