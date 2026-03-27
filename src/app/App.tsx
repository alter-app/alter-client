import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { ManagerHomePage } from '@/pages/manager/home'
import { SocialPage } from '@/pages/manager/social'
import { SocialChatPage } from '@/pages/manager/social-chat'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { JobLookupMapPage } from '@/pages/user/job-lookup-map'
import { SchedulePage } from '@/pages/user/schedule'
import { UserHomePage } from '@/pages/user/home'
import { WorkspaceMembersPage } from '@/pages/user/workspace-members'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import { MobileLayoutWithDocbar } from '@/shared/ui/MobileLayoutWithDocbar'

function MobileRouteLayoutWithoutDocbar() {
  return (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  )
}

function MobileRouteLayoutWithDocbar() {
  return (
    <MobileLayoutWithDocbar>
      <Outlet />
    </MobileLayoutWithDocbar>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileRouteLayoutWithoutDocbar />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route
            path="/workspaces/:workspaceId/members"
            element={<WorkspaceMembersPage />}
          />
        </Route>

        <Route path="/manager/home" element={<ManagerHomePage />} />
        <Route path="/manager/social" element={<SocialPage />} />
        <Route path="/manager/social/chat" element={<SocialChatPage />} />
        <Route element={<MobileRouteLayoutWithDocbar />}>
          <Route path="/job-lookup-map" element={<JobLookupMapPage />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/manager/home" element={<ManagerHomePage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
