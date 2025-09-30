import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repoName = "/3d-snake-game/";

// https://vite.dev/config/
export default defineConfig({
  base: repoName,
  plugins: [react(), tailwindcss()],
});
