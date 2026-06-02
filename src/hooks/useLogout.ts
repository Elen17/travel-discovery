import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout as logoutApi } from '@/api/auth'
import { useAppDispatch } from '@/store/hooks'
import { clearCredentials } from '@/store/authSlice'

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await logoutApi()
    } catch {
      // Always clear local session even if the server call fails (expired token, network, etc.)
    } finally {
      dispatch(clearCredentials())
      setIsLoggingOut(false)
      navigate('/auth/login', { replace: true })
    }
  }, [dispatch, navigate])

  return { logout, isLoggingOut }
}
