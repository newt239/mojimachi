type FontCardProps = {
  text: string;
  family: string;
  styles: string[];
  fullName: string;
};

const FontCard: React.FC<FontCardProps> = ({
  text,
  family,
  styles,
  fullName,
}) => {
  return (
    <div
      key={fullName}
      style={{
        fontFamily: family,
        fontWeight: styles[0],
        border: "1px solid white",
      }}
    >
      <p>{family}</p>
      <p>{text}</p>
    </div>
  );
};

export default FontCard;
