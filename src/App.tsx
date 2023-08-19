import { Route, Routes, useLocation } from "react-router-dom";

import { Box, Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import Header from "~/components/Header";
import Menubar from "~/components/Menubar";
import Sidebar from "~/components/Sidebar";
import FavoritePage from "~/pages/Favorite";
import HomePage from "~/pages/Home";
import FamilyPage from "~/pages/family/[family_name]";
import FontPage from "~/pages/family/[family_name]/font/[font_name]";
import NotFoundPage from "~/pages/not-found";
import { displayModeAtom } from "~/utils/jotai";

function App() {
  const location = useLocation();
  const isRoot = location.pathname === "/" || location.pathname === "/favorite";

  const displayMode = useAtomValue(displayModeAtom);
  return (
    <div>
      <Header />
      <Flex>
        <Sidebar />
        <Menubar />
        <Box
          position="fixed"
          top="8rem"
          right="15rem"
          w="calc(100% - 15rem)"
          h="calc(100vh - 8rem)"
          overflowX={displayMode === "vertical" ? undefined : "hidden"}
          overflowY={
            isRoot && displayMode === "vertical" ? "hidden" : undefined
          }
          id="mainArea"
        >
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="favorite" element={<FavoritePage />} />
              <Route path="family">
                <Route path=":family_name">
                  <Route index element={<FamilyPage />} />
                  <Route path="font">
                    <Route path=":font_name" element={<FontPage />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Box>
      </Flex>
    </div>
  );
}

export default App;
