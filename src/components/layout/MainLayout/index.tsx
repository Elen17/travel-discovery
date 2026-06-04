import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../Footer'
import { Header } from '../Header'
import styles from './styles.module.css'

const { Content } = Layout

export const MainLayout = () => {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isPlanner = pathname === '/planner'

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
