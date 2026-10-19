// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The root route table for the entire application.
// Explanation: I define which page component renders for each URL path. I
//   import Routes, Route, and Navigate from react-router-dom because React
//   Router v7 requires the dom package for these components. HashRouter wraps
//   this in main.tsx, so paths appear after the # in the URL. The wildcard
//   route catches unknown paths and redirects to the landing page.
// In Other Words: I made a simple map that says "this address shows this page"
//   and any wrong address brings you back to the front door.
// ─────────────────────────────────────────────────────────────────────────────

import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import { ColorVisionFilters } from './components/A11yPanel'

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The main App component that renders the routes.
// Explanation: I wrap the routes in a fragment so I can include the
//   ColorVisionFilters component (which applies accessibility filters) alongside
//   the Routes without adding extra DOM elements. The Routes component contains
//   individual Route definitions for each page.
// In Other Words: I set up the navigation and turn on the color helper for
//   people who need it.
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <ColorVisionFilters />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        {/* Any unknown path lands on the homepage — static hosts have no rewrites */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
