import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES
    ? "local-font-emulator" // レポジトリ名を設定
    : "./",
  plugins: [react()],
});
