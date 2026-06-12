import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/auth'
import { addFavourite, FAVOURITE_HOTELS_QUERY_KEY, FAVOURITES_QUERY_KEY, getFavourites, removeFavourite } from '@/api/favourites'
import { trackSaveFavourite, type SaveFavouriteDetails } from '@/services/analytics'
import { LoginRequiredModal } from '@/components/common/LoginRequiredModal'
import { SESSION_EXPIRED_MODAL_I18N } from '@/components/common/SessionExpiredModal/const'
import { SessionExpiredModal } from '@/components/common/SessionExpiredModal'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials } from '@/store/authSlice'
import { getLastUserEmail, hasValidSession, isSessionExpired } from '@/utils/session'

export const useFavouriteSave = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [pendingHotelId, setPendingHotelId] = useState<number | null>(null)
  const [pendingFavouriteDetails, setPendingFavouriteDetails] = useState<
    SaveFavouriteDetails | undefined
  >(undefined)
  const [savingHotelId, setSavingHotelId] = useState<number | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [reauthLoading, setReauthLoading] = useState(false)

  const sessionIsValid = isAuthenticated && hasValidSession()

  const { data: favourites = [] } = useQuery({
    queryKey: FAVOURITES_QUERY_KEY,
    queryFn: getFavourites,
    enabled: sessionIsValid,
  })

  const savedHotelIds = useMemo(
    () => new Set(favourites.map((favourite) => favourite.hotelId)),
    [favourites],
  )

  const persistFavourite = useCallback(
    async (hotelId: number, details?: SaveFavouriteDetails) => {
      setSavingHotelId(hotelId)
      try {
        await addFavourite(hotelId)
        trackSaveFavourite(hotelId, details)
        await queryClient.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEY })
        await queryClient.invalidateQueries({ queryKey: FAVOURITE_HOTELS_QUERY_KEY })
      } finally {
        setSavingHotelId(null)
      }
    },
    [queryClient],
  )

  const persistRemoveFavourite = useCallback(
    async (hotelId: number) => {
      setSavingHotelId(hotelId)
      try {
        await removeFavourite(hotelId)
        await queryClient.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEY })
        await queryClient.invalidateQueries({ queryKey: FAVOURITE_HOTELS_QUERY_KEY })
      } finally {
        setSavingHotelId(null)
      }
    },
    [queryClient],
  )

  const saveFavourite = useCallback(
    async (hotelId: number, details?: SaveFavouriteDetails) => {
      if (!isAuthenticated) {
        setPendingHotelId(hotelId)
        setPendingFavouriteDetails(details)
        setLoginModalOpen(true)
        return
      }

      if (isSessionExpired()) {
        setPendingHotelId(hotelId)
        setPendingFavouriteDetails(details)
        setSessionError(null)
        setSessionModalOpen(true)
        return
      }

      await persistFavourite(hotelId, details)
    },
    [isAuthenticated, persistFavourite],
  )

  const toggleFavourite = useCallback(
    async (hotelId: number) => {
      if (savedHotelIds.has(hotelId)) {
        if (!isAuthenticated) {
          return
        }

        if (isSessionExpired()) {
          setSessionError(null)
          setSessionModalOpen(true)
          return
        }

        await persistRemoveFavourite(hotelId)
        return
      }

      await saveFavourite(hotelId)
    },
    [savedHotelIds, isAuthenticated, persistRemoveFavourite, saveFavourite],
  )

  const handleLoginRedirect = () => {
    setLoginModalOpen(false)
    navigate('/auth/login', { state: { from: { pathname: '/' } } })
  }

  const handleSessionCancel = () => {
    setSessionModalOpen(false)
    setSessionError(null)
    setPendingHotelId(null)
    setPendingFavouriteDetails(undefined)
  }

  const handleSessionSubmit = async (password: string) => {
    const email = user?.email ?? getLastUserEmail()
    if (!email) {
      setSessionError(t(SESSION_EXPIRED_MODAL_I18N.errors.generic))
      return
    }

    setReauthLoading(true)
    setSessionError(null)

    try {
      const response = await login({ email, password })
      dispatch(setCredentials(response))
      setSessionModalOpen(false)

      if (pendingHotelId !== null) {
        await persistFavourite(pendingHotelId, pendingFavouriteDetails)
        setPendingHotelId(null)
        setPendingFavouriteDetails(undefined)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setSessionError(t('pages.auth.errors.invalidCredentials'))
      } else {
        setSessionError(t(SESSION_EXPIRED_MODAL_I18N.errors.generic))
      }
    } finally {
      setReauthLoading(false)
    }
  }

  const modals = (
    <>
      <LoginRequiredModal
        open={loginModalOpen}
        onCancel={() => {
          setLoginModalOpen(false)
          setPendingHotelId(null)
          setPendingFavouriteDetails(undefined)
        }}
        onLogin={handleLoginRedirect}
      />
      <SessionExpiredModal
        open={sessionModalOpen}
        email={user?.email ?? getLastUserEmail() ?? ''}
        loading={reauthLoading}
        errorMessage={sessionError}
        onCancel={handleSessionCancel}
        onSubmit={handleSessionSubmit}
      />
    </>
  )

  return {
    saveFavourite,
    toggleFavourite,
    savedHotelIds,
    savingHotelId,
    modals,
  }
}
