import { Navigate } from 'react-router-dom'
import { PageLoader } from '@/components/common/PageLoader'
import { useAppSelector } from '@/store/hooks'
import { UserRole } from '@/types/user'
import type { AdminRouteProps } from './types'

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!user) {
    return <PageLoader />
  }

  if (user.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />
  }

  return children
}
