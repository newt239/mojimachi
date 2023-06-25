import { Route, Routes } from "react-router-dom";

import { Box, Flex } from "@chakra-ui/react";

import FamilyPage from "./pages/Family";

import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import HomePage from "~/pages/Home";
import NotFoundPage from "~/pages/NotFound";

function App() {
  return (
    <div>
      <Header />
      <Flex>
        <Sidebar />
        <Box flexGrow={1} p="1rem">
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="family">
                <Route path=":family_name" element={<FamilyPage />} />
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
