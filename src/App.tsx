import { Route, Routes } from "react-router-dom";

import FamilyPage from "./pages/Family";

import Header from "~/components/Header";
import HomePage from "~/pages/Home";
import NotFoundPage from "~/pages/NotFound";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="family">
            <Route path=":family_name" element={<FamilyPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
