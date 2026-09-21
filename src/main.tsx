import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "./app";
import { hydrateStores } from "./lib/store";
import "./styles/global.css";

const container = document.querySelector("#root");

if (container) {
  // 設定を読み終えてから描画し、初期値のちらつきを避ける
  await hydrateStores();
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
