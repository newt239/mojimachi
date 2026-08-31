import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: process.env.TAURI_ENV_DEBUG ? false : "oxc",
    sourcemap: Boolean(process.env.TAURI_ENV_DEBUG),
    target: process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari13",
  },
  clearScreen: false,
  envPrefix: ["VITE_", "TAURI_ENV_"],
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 1420,
    strictPort: true,
  },
});
