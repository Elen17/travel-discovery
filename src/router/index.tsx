import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminRoute } from '@/components/common/AdminRoute'
import { PageLoader } from '@/components/common/PageLoader'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'

const HomePage = lazy(() => import('@/pages/Home'))
const DestinationsPage = lazy(() => import('@/pages/Destinations'))
const HotelDetailPage = lazy(() => import('@/pages/HotelDetail'))
const GuidesPage = lazy(() => import('@/pages/Guides'))
const GuideDetailPage = lazy(() => import('@/pages/GuideDetail'))
const EventsPage = lazy(() => import('@/pages/Events'))
const PlannerPage = lazy(() => import('@/pages/Planner'))
const BookingsPage = lazy(() => import('@/pages/Bookings'))
const ProfilePage = lazy(() => import('@/pages/Profile'))
const AnalyticsPage = lazy(() => import('@/pages/Analytics'))
const AuthPage = lazy(() => import('@/pages/Auth'))
const UsersPage = lazy(() => import('@/pages/Users'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'destinations', element: withSuspense(<DestinationsPage />) },
      { path: 'hotel/:id', element: withSuspense(<HotelDetailPage />) },
      { path: 'guides', element: withSuspense(<GuidesPage />) },
      { path: 'guides/:destination', element: withSuspense(<GuideDetailPage />) },
      { path: 'events', element: withSuspense(<EventsPage />) },
      { path: 'planner', element: withSuspense(<PlannerPage />) },
      {
        path: 'analytics',
        element: <AdminRoute>{withSuspense(<AnalyticsPage />)}</AdminRoute>,
      },
      {
        path: 'users',
        element: <AdminRoute>{withSuspense(<UsersPage />)}</AdminRoute>,
      },
      {
        path: 'bookings',
        element: <ProtectedRoute>{withSuspense(<BookingsPage />)}</ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute>{withSuspense(<ProfilePage />)}</ProtectedRoute>,
      },
      { path: 'login', element: <Navigate to="/auth/login" replace /> },
      { path: 'auth/login', element: withSuspense(<AuthPage />) },
      { path: '404', element: withSuspense(<NotFoundPage />) },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
])
