// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: TypeScript declarations for Vite environment.
// Explanation: I tell TypeScript to recognize Vite's client types including
//   CSS imports, image imports, and environment variables. Without this,
//   TypeScript complains when I import CSS files or other assets because it
//   doesn't know what those files are.
// In Other Words: I gave the code checker a dictionary so it understands
//   when I import stylesheets and pictures in my app.
// ─────────────────────────────────────────────────────────────────────────────

/// <reference types="vite/client" />
