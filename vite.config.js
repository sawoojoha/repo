import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/google-form-api": {
        target: "https://script.google.com",
        changeOrigin: true,
        rewrite: () =>
          "/macros/library/d/1fqO677IJM7oYZA17_Lt8TNJXzcHtYfdnq4f5BESeW2glaf9u6JKXS04S/2",
      },
    },
  },
});