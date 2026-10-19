// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The application entry point that mounts the React app.
// Explanation: I import HashRouter from react-router-dom (not react-router)
//   because React Router v7 requires importing routing components from the
//   dom-specific package. HashRouter uses URL fragments (#/app) instead of
//   browser history, which works on static hosts like GitHub Pages without
//   server configuration. I also register the service worker for PWA support.
// In Other Words: I start the app using a navigation style that works on
//   simple file servers, and I load the offline capability.
// ─────────────────────────────────────────────────────────────────────────────

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The React root render call.
// Explanation: I create a root element and render the App component wrapped
//   in StrictMode for development checks and HashRouter for routing. The
//   exclamation mark after getElementById tells TypeScript the element exists.
// In Other Words: I put my app on the screen and turn on the helper that
//   warns me about mistakes.
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
//   shell caches for offline use. The catch ensures unsupported browsers skip
//   this silently without crashing.
// In Other Words: I save a copy of my app on the device so it works without
//   internet, and I made sure it won't break if the device can't do that.
// ─────────────────────────────────────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  })
}
