import { lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { ManagerHomePage } from '@/pages/manager/home'
import { ManagerWorkerSchedulePage } from '@/pages/manager/worker-schedule'
import { ManagerWorkerScheduleLegacyEntryRedirect } from '@/pages/manager/worker-schedule/LegacyEntryRedirect'
import { SocialPage } from '@/pages/manager/social'
import { SocialChatPage } from '@/pages/manager/social-chat'
import { LoginPage } from '@/pages/login'
import { KakaoCallbackPage } from '@/pages/oauth/KakaoCallbackPage'
import { JobLookupMapPage } from '@/pages/user/job-lookup-map'
import { JobLookupMapApplyPage } from '@/pages/user/job-lookup-map-apply'
import { JobLookupMapDetailPage } from '@/pages/user/job-lookup-map-detail'
import { SchedulePage } from '@/pages/user/schedule'
import { UserHomePage } from '@/pages/user/home'
import { WorkspaceMembersPage } from '@/pages/user/workspace-members'
import { WorkspacePage } from '@/pages/user/workspace'
import { WorkspaceDetailPage } from '@/pages/user/workspace-detail'
import { AppliedStoresPage } from '@/pages/user/applied-stores'
import { SubstituteRequestPage } from '@/pages/user/substitute-request'
import { ManagerSubstituteRequestPage } from '@/pages/manager/substitute-request'
import { StoreRegisterPage } from '@/pages/manager/store-register'
import { ManagerWorkerInvitePage } from '@/pages/manager/worker-invite'
import { WorkspaceJoinPage } from '@/pages/user/workspace-join'
import { MyPage } from '@/pages/my'
import { ProfileEditPage } from '@/pages/my/profile'
import { ErrorPageRoute } from '@/pages/error'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import { MobileLayoutWithDocbar } from '@/shared/ui/MobileLayoutWithDocbar'
import { HomeRouteGuard } from '@/shared/ui/common/HomeRouteGuard'
import { ROUTES } from '@/shared/constants/routes'

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
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTES.OAUTH.KAKAO_CALLBACK}
            element={<KakaoCallbackPage />}
          />
          <Route
            path={ROUTES.AUTH.SIGNUP}
            element={
              <Suspense fallback={null}>
                <SignupPage />
              </Suspense>
            }
          />
          <Route path={ROUTES.USER.SCHEDULE} element={<SchedulePage />} />
          <Route
            path={ROUTES.USER.WORKSPACE_MEMBERS_PATTERN}
            element={<WorkspaceMembersPage />}
          />
          <Route path={ROUTES.USER.WORKSPACE} element={<WorkspacePage />} />
          <Route
            path={ROUTES.USER.WORKSPACE_JOIN}
            element={<WorkspaceJoinPage />}
          />
          <Route
            path={ROUTES.USER.WORKSPACE_DETAIL_PATTERN}
            element={<WorkspaceDetailPage />}
          />
          <Route
            path={ROUTES.USER.APPLIED_STORES}
            element={<AppliedStoresPage />}
          />
          <Route path={ROUTES.MY.PROFILE} element={<ProfileEditPage />} />
          <Route
            path={ROUTES.MANAGER.WORKER_SCHEDULE}
            element={<ManagerWorkerScheduleLegacyEntryRedirect />}
          />
          <Route
            path={ROUTES.MANAGER.WORKER_SCHEDULE_PATTERN}
            element={<ManagerWorkerSchedulePage />}
          />
          <Route
            path={ROUTES.MANAGER.STORE_REGISTER}
            element={<StoreRegisterPage />}
          />
          <Route
            path={ROUTES.MANAGER.WORKER_INVITE}
            element={<ManagerWorkerInvitePage />}
          />
        </Route>

        <Route element={<MobileRouteLayoutWithDocbar />}>
          <Route
            path={ROUTES.USER.JOB_LOOKUP_MAP}
            element={<JobLookupMapPage />}
          />
          <Route
            path={ROUTES.USER.JOB_LOOKUP_MAP_DETAIL}
            element={<JobLookupMapDetailPage />}
          />
          <Route
            path={ROUTES.USER.JOB_LOOKUP_MAP_APPLY}
            element={<JobLookupMapApplyPage />}
          />
          <Route
            path={ROUTES.USER.HOME}
            element={
              <HomeRouteGuard expected="USER">
                <UserHomePage />
              </HomeRouteGuard>
            }
          />
          <Route
            path={ROUTES.MANAGER.HOME}
            element={
              <HomeRouteGuard expected="MANAGER">
                <ManagerHomePage />
              </HomeRouteGuard>
            }
          />
          <Route
            path={ROUTES.MANAGER.SUBSTITUTE_REQUEST}
            element={
              <HomeRouteGuard expected="MANAGER">
                <ManagerSubstituteRequestPage />
              </HomeRouteGuard>
            }
          />
          <Route path={ROUTES.MANAGER.SOCIAL} element={<SocialPage />} />
          <Route
            path={ROUTES.MANAGER.SOCIAL_CHAT}
            element={<SocialChatPage />}
          />
          <Route path={ROUTES.MY.ROOT} element={<MyPage />} />
          <Route
            path={ROUTES.USER.SUBSTITUTE_REQUEST_DETAIL_PATTERN}
            element={
              <HomeRouteGuard expected="USER">
                <SubstituteRequestPage />
              </HomeRouteGuard>
            }
          />
          <Route
            path={ROUTES.USER.SUBSTITUTE_REQUEST}
            element={
              <HomeRouteGuard expected="USER">
                <SubstituteRequestPage />
              </HomeRouteGuard>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
        <Route path="*" element={<ErrorPageRoute />} />
      </Routes>
    </BrowserRouter>
  )
}
