import { Route, Routes } from "react-router-dom";

import { AppShell } from "@mantine/core";

import SideBar from "./SideBar";

import FontPage from "~/pages/Font";
import FontList from "~/pages/Home";

const Wrapper = () => {
  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      padding="md"
      navbar={<SideBar />}
      styles={{
        main: {
          backgroundColor: "hsl(45,10%, 90%)",
        },
      }}
    >
      <Routes>
        <Route path="/">
          <Route index element={<FontList />} />
          <Route path="pinned" element={<FontList pinned />} />
          <Route path="font">
            <Route path=":fontFamily" element={<FontPage />} />
          </Route>
        </Route>
      </Routes>
    </AppShell>
  );
};

export default Wrapper;
