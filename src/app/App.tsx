import { lazy, Suspense } from 'react'
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
import { JobLookupMapPage } from '@/pages/user/job-lookup-map'
import { SchedulePage } from '@/pages/user/schedule'
import { UserHomePage } from '@/pages/user/home'
import { WorkspaceMembersPage } from '@/pages/user/workspace-members'
import { WorkspacePage } from '@/pages/user/workspace'
import { WorkspaceDetailPage } from '@/pages/user/workspace-detail'
import { AppliedStoresPage } from '@/pages/user/applied-stores'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import { MobileLayoutWithDocbar } from '@/shared/ui/MobileLayoutWithDocbar'

const SignupPage = lazy(async () => {
  const m = await import('@/pages/signup')
  return { default: m.SignupPage }
})

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

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const routerBasename =
  basePath && basePath.startsWith('/') && basePath !== '/'
    ? basePath
    : undefined

export function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route element={<MobileRouteLayoutWithoutDocbar />}>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/signup"
            element={
              <Suspense fallback={null}>
                <SignupPage />
              </Suspense>
            }
          />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route
            path="/workspaces/:workspaceId/members"
            element={<WorkspaceMembersPage />}
          />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route
            path="/workspace/:workspaceId"
            element={<WorkspaceDetailPage />}
          />
          <Route path="/applied-stores" element={<AppliedStoresPage />} />
        </Route>

        <Route element={<MobileRouteLayoutWithDocbar />}>
          <Route path="/job-lookup-map" element={<JobLookupMapPage />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/manager/home" element={<ManagerHomePage />} />
          <Route path="/manager/social" element={<SocialPage />} />
          <Route path="/manager/social/chat" element={<SocialChatPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
