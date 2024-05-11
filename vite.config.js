// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": "backend-production-fada0.up.railway.app", // Replace with your actual backend URL
//     },
//   },
//   plugins: [react()],
// });

import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        // No trailing slash here
        target: "http://localhost:3000/api", // Replace with your actual backend URL
        // target: "https://backend-production-fada0.up.railway.app/api",
        changeOrigin: true, // Ensures correct headers are sent
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove '/api' prefix before proxying
      },
    },
  },
  plugins: [react()],
});
