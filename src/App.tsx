import { MantineProvider } from "@mantine/core";

import ScrollTop from "~/components/ScrollTop";
import Wrapper from "~/components/Wrapper";
import "./App.css";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ScrollTop />
      <Wrapper />
    </MantineProvider>
  );
}

export default App;
