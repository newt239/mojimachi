import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const host = process.env["TAURI_DEV_HOST"];
const isDebug = Boolean(process.env["TAURI_ENV_DEBUG"]);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "~": fileURLToPath(new URL("src", import.meta.url)) },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host ?? false,
    hmr: host ? { protocol: "ws", host, port: 1421 } : true,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  envPrefix: ["VITE_", "TAURI_ENV_"],
  build: {
    target: process.env["TAURI_ENV_PLATFORM"] === "windows" ? "chrome105" : "safari15",
    minify: !isDebug,
    sourcemap: isDebug,
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
  },
});
