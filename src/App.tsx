import { Routes, Route, Navigate } from 'react-router'
import Landing from './pages/Landing'
import Home from './pages/Home'
import { ColorVisionFilters } from './components/A11yPanel'

export default function App() {
  return (
    <>
      <ColorVisionFilters />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        {/* Static hosts have no rewrites — any unknown path lands on the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
