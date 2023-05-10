import { MantineProvider } from "@mantine/core";

import Wrapper from "~/components/Wrapper";
import "./App.css";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Wrapper />
    </MantineProvider>
  );
}

export default App;
