import classes from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={classes.header}>
      <h1 className={classes.siteName}>Local Font Emulator</h1>
    </header>
  );
};

export default Header;
