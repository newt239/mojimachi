import { MantineProvider } from "@mantine/core";
import "./App.css";
import Wrapper from "./components/Wrapper";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Wrapper />
    </MantineProvider>
  );
}

export default App;
