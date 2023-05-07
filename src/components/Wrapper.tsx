import { BrowserRouter, Route, Routes } from "react-router-dom";
import FontList from "./FontList";
import Header from "./Header";
import SideBar from "./SideBar";
import classes from "./Wrapper.module.css";

const Wrapper = () => {
  return (
    <BrowserRouter>
      <div className={classes.wrapper}>
        <SideBar />
        <div className={classes.main}>
          <Header />
          <Routes>
            <Route path="/">
              <Route index element={<FontList />} />
              <Route path="pinned" element={<FontList pinned />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Wrapper;
