import { useState } from "react";
import "./App.css";
import FontList from "./components/FontList";

function App() {
  const [text, setText] = useState("Hello, World!");

  return (
    <div>
      <h1>Local Font Emulator</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <FontList text={text} />
    </div>
  );
}

export default App;
