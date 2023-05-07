import { Link } from "react-router-dom";
import classes from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={classes.header}>
      <Link to="/">
        <h1 className={classes.siteName}>Local Font Emulator</h1>
      </Link>
    </header>
  );
};

export default Header;
