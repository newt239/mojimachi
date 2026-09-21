import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "./app";
import "./styles/global.css";

const container = document.querySelector("#root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
