import { Route, Routes, useLocation } from "react-router-dom";

import { Box, Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import { Header } from "#/components/header";
import { Menubar } from "#/components/menubar";
import { Sidebar } from "#/components/sidebar";
import { FamilyPage } from "#/pages/family";
import { FavoritePage } from "#/pages/favorite";
import { FontPage } from "#/pages/font";
import { HomePage } from "#/pages/home";
import { NotFoundPage } from "#/pages/not-found";
import { displayModeAtom } from "#/utils/jotai";

export const App = () => {
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
          overflowY={isRoot && displayMode === "vertical" ? "hidden" : undefined}
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
};
