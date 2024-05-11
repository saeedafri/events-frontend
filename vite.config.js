import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default ({ command }) => {
  const isProduction = command === "build";

  return defineConfig({
    server: {
      proxy: {
        "/api": {
          target: isProduction
            ? "https://backend-production-fada0.up.railway.app/api"
            : "http://localhost:3000/api", // Use local URL during development
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [react()],
  });
};
