import { Route, Routes } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";

import Header from "~/components/Header";
import HomePage from "~/pages/Home";

function App() {
  const getFontNameList = async () => {
    const fontNameList = await invoke("get_font_name_list");
    console.log(fontNameList);
  };

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
      <Button onClick={getFontNameList}>get</Button>
    </div>
  );
}

export default App;
