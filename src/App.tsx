import { Route, Routes } from "react-router-dom";

import Header from "~/components/Header";
import HomePage from "~/pages/Home";

function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
