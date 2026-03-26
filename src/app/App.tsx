import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ManagerHomePage } from '@/pages/manager/home'
import { SocialPage } from '@/pages/manager/social'
import { SocialChatPage } from '@/pages/manager/social-chat'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { JobLookupMapPage } from '@/pages/user/job-lookup-map'
import { SchedulePage } from '@/pages/user/schedule'
import { WorkspaceMembersPage } from '@/pages/user/workspace-members'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/job-lookup-map" element={<JobLookupMapPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route
          path="/workspaces/:workspaceId/members"
          element={<WorkspaceMembersPage />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/manager/home" element={<ManagerHomePage />} />
        <Route path="/manager/social" element={<SocialPage />} />
        <Route path="/manager/social/chat" element={<SocialChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}
