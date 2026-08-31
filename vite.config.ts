import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    minify: process.env.TAURI_DEBUG ? false : "esbuild",
    sourcemap: Boolean(process.env.TAURI_DEBUG),
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
  },
  clearScreen: false,
  envPrefix: ["VITE_", "TAURI_"],
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 1420,
    strictPort: true,
  },
});
