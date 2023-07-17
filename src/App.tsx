import { Route, Routes } from "react-router-dom";

import { Box, Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import Header from "./components/Header";
import Menubar from "./components/Menubar";
import FontPage from "./pages/Font";
import { displayModeAtom } from "./utils/jotai";

import Sidebar from "~/components/Sidebar";
import FamilyPage from "~/pages/Family";
import FavoritePage from "~/pages/Favorite";
import HomePage from "~/pages/Home";
import NotFoundPage from "~/pages/NotFound";

function App() {
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
          right="20rem"
          w="calc(100% - 20rem)"
          h="calc(100vh - 8rem)"
          overflowX={displayMode === "vertical" ? "scroll" : "hidden"}
          overflowY={displayMode === "vertical" ? "hidden" : "scroll"}
        >
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="favorite" element={<FavoritePage />} />
              <Route path="family">
                <Route path=":family_name" element={<FamilyPage />} />
              </Route>
              <Route path="font">
                <Route path=":font_name" element={<FontPage />} />
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
