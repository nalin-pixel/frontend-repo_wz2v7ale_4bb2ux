import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import CompassForm from './components/CompassForm'
import EditorPage from './components/EditorPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/nieuw" element={<CompassForm />} />
      <Route path="/bewerken/:id" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
