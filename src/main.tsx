import React from "react";
import { BrowserRouter } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";

import { App } from "#/app";
import "#/global.css";
import { theme } from "#/utils/theme";

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error("ルート要素 #root が見つかりません");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
