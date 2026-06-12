import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { Layout } from 'antd'
import { useCurrentUserHydration } from '@/hooks'
import { initAppEventContext, setAnalyticsUserId } from '@/services/appEventContext'
import { initGA, trackPageView } from '@/services/analytics'
import { useAppSelector } from '@/store/hooks'
import { Footer } from '../Footer'
import { Header } from '../Header'
import styles from './styles.module.css'

const { Content } = Layout

export const MainLayout = () => {
  const { pathname } = useLocation()
  const location = useLocation()
  useCurrentUserHydration()
  const userId = useAppSelector((state) => state.auth.user?.id ?? null)
  const isHome = pathname === '/'
  const isPlanner = pathname === '/planner'

  useEffect(() => {
    initAppEventContext()
    initGA()
  }, [])

  useEffect(() => {
    setAnalyticsUserId(userId)
  }, [userId])

  useEffect(() => {
    // TypeScript ensures location.pathname is a string
    trackPageView(location.pathname + location.search);
  }, [location]);

  const contentClass = isHome
    ? styles.contentHome
    : isPlanner
      ? styles.contentPlanner
      : styles.content

  return (
    <Layout className={styles.layout}>
      <Header />
      <Content className={contentClass}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}
