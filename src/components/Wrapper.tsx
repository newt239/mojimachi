import { Route, Routes } from "react-router-dom";

import { AppShell } from "@mantine/core";

import EachFont from "./EachFont";
import FontList from "./FontList";
import Header from "./Header";
import SideBar from "./SideBar";

const Wrapper = () => {
  return (
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
  );
};

export default Wrapper;
