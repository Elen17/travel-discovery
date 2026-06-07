import { Spin } from 'antd'
import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
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
const AuthPage = lazy(() => import('@/pages/Auth'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
    <Spin size="large" />
  </div>
)

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
      { path: 'bookings', element: withSuspense(<BookingsPage />) },
      { path: 'profile', element: withSuspense(<ProfilePage />) },
      { path: 'login', element: <Navigate to="/auth/login" replace /> },
      { path: 'auth/login', element: withSuspense(<AuthPage />) },
      { path: '404', element: withSuspense(<NotFoundPage />) },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
])
