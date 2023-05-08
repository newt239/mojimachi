import { AppShell } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EachFont from "./EachFont";
import FontList from "./FontList";
import Header from "./Header";
import SideBar from "./SideBar";

const Wrapper = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        padding="md"
        navbar={<SideBar />}
        header={<Header />}
      >
        <Routes>
          <Route path="/">
            <Route index element={<FontList />} />
            <Route path="pinned" element={<FontList pinned />} />
            <Route path="font">
              <Route path=":fontFamily" element={<EachFont />} />
            </Route>
          </Route>
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

export default Wrapper;
