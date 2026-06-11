import { Spin } from 'antd'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { UserRole } from '@/types/user'
import type { AdminRouteProps } from './types'

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (user.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />
  }

  return children
}
