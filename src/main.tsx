import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The application entry point that mounts the React app.
// Explanation: I use HashRouter instead of BrowserRouter because GitHub Pages
//   is a static file host with no server-side rewrites. With BrowserRouter,
//   refreshing on any route other than / returns a 404. HashRouter puts the
//   route in the URL fragment (#/app) which never hits the server — GitHub
//   Pages always serves index.html and the client-side router takes over.
// In Other Words: I chose a navigation style that works on a simple file
//   server so the refresh button never breaks my app.
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: Service worker registration for offline PWA support.
// Explanation: I register the service worker after the page loads so the app
//   shell caches for offline use. The catch(() => {}) ensures unsupported
//   browsers silently skip this without crashing the app.
// In Other Words: I save a copy of my app on the device so it works even
//   without internet, and I made sure it won't cause problems if the
//   device doesn't support that feature.
// ─────────────────────────────────────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  })
}
