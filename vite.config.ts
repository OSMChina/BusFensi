import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Customize how modules are chunked.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Group React and ReactDOM into one chunk.
            if (id.includes("react") || id.includes("react-dom")|| id.includes("@dnd-kit")) {
              return "react";
            }
            // Group Pixi and related libraries together.
            if (id.includes("pixi") || id.includes("@pixi")) {
              return "pixi";
            }
            // Group FontAwesome libraries together.
            if (id.includes("@fortawesome") || id.includes("zustand")) {
              return "fazustand";
            }
            // Default vendor chunk for other libraries.
            return "vendor";
          }
        },
      },
    }
  }
})
