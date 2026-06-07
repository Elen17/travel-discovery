import { useEffect } from 'react'
import { getCurrentUser } from '@/api/users'
import { clearCredentials, setUser } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export const useCurrentUserHydration = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || user) {
      return
    }

    let cancelled = false

    getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) {
          dispatch(setUser(currentUser))
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch(clearCredentials())
        }
      })

    return () => {
      cancelled = true
    }
  }, [dispatch, isAuthenticated, user])
}
