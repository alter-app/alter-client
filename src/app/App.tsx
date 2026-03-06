import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { JobLookupMapPage } from '@/pages/job-lookup-map'
import SchedulePage from '@/pages/schedule'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/job-lookup-map" element={<JobLookupMapPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
