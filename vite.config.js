import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/marketing-automation/",
  build: { sourcemap: false },
  plugins: [react()],
});
