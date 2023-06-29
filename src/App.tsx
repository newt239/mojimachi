import { Route, Routes } from "react-router-dom";

import { Box, Flex } from "@chakra-ui/react";

import FontPage from "./pages/Font";

import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import FamilyPage from "~/pages/Family";
import FavoritePage from "~/pages/Favorite";
import HomePage from "~/pages/Home";
import NotFoundPage from "~/pages/NotFound";

function App() {
  return (
    <div>
      <Header />
      <Flex>
        <Sidebar />
        <Box w="80%">
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
