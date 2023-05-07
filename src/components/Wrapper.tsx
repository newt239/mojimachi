import { useState } from "react";
import FontList from "./FontList";
import Header from "./Header";
import SideBar from "./SideBar";
import classes from "./Wrapper.module.css";

const Wrapper = () => {
  const [text, setText] = useState("Hello, World!");

  return (
    <div className={classes.wrapper}>
      <SideBar />
      <div className={classes.main}>
        <Header />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <FontList text={text} />
      </div>
    </div>
  );
};

export default Wrapper;
