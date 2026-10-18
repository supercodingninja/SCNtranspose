import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The Vite build configuration for GitHub Pages deployment.
// Explanation: I set the base path to '/SCNtranspose/' because GitHub Pages
//   serves project sites at username.github.io/reponame/. Without this, all
//   asset URLs (JS, CSS, images, video) would resolve to the domain root and
//   return 404. The alias @ points to ./src so imports stay clean.
// In Other Words: I told the builder "my app lives in the SCNtranspose folder"
//   so all the pieces load from the right place instead of getting lost.
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  base: '/SCNtranspose/',
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
