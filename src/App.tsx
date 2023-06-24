import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";

import Header from "~/components/Header";
import HomePage from "~/pages/Home";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  const getFontNameList = async () => {
    const fontNameList = await invoke("get_font_name_list");
    console.log(fontNameList);
  };

  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
      <Button onClick={getFontNameList}>get</Button>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
