import FontList from "./FontList";
import Header from "./Header";
import SideBar from "./SideBar";
import classes from "./Wrapper.module.css";

const Wrapper = () => {
  return (
    <div className={classes.wrapper}>
      <SideBar />
      <div className={classes.main}>
        <Header />
        <FontList />
      </div>
    </div>
  );
};

export default Wrapper;
