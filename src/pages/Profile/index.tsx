import { Alert, Spin, Tabs } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  FAVOURITE_HOTELS_QUERY_KEY,
  FAVOURITES_QUERY_KEY,
  fetchFavouriteHotels,
  removeFavourite,
} from '@/api/favourites'
import { updateProfile, uploadAvatarTemp } from '@/api/users'
import { buildPlannerUrl, resolveExplorationFromDestination } from '@/pages/Planner/utils'
import { ProfileHeaderCard } from '@/components/common/ProfileHeaderCard'
import { SavedPlaceCard } from '@/components/common/SavedPlaceCard'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUser } from '@/store/authSlice'
import { hasValidSession } from '@/utils/session'
import { PROFILE_I18N } from './const'
import styles from './styles.module.css'
import type { ProfileTab } from './types'
import { validateAvatarFile } from './utils'

const ProfilePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { isAuthenticated, user: authUser } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState<ProfileTab>('savedPlaces')
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const sessionIsValid = isAuthenticated && hasValidSession()

  const { data: savedHotels = [], isLoading, isError } = useQuery({
    queryKey: FAVOURITE_HOTELS_QUERY_KEY,
    queryFn: fetchFavouriteHotels,
    enabled: sessionIsValid,
  })

  const removeMutation = useMutation({
    mutationFn: removeFavourite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: FAVOURITE_HOTELS_QUERY_KEY })
    },
  })

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const upload = await uploadAvatarTemp(file)
      return updateProfile({ avatarTempId: upload.tempId })
    },
    onSuccess: (updatedUser) => {
      dispatch(setUser(updatedUser))
      setAvatarPreviewUrl(null)
      setAvatarError(null)
      setAvatarMessage(t(PROFILE_I18N.avatar.success))
    },
    onError: () => {
      setAvatarPreviewUrl(null)
      setAvatarMessage(null)
      setAvatarError(t(PROFILE_I18N.avatar.errors.generic))
    },
  })

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreviewUrl)
      }
    }
  }, [avatarPreviewUrl])

  const displayUser = useMemo(() => {
    if (!authUser) {
      return null
    }

    return {
      fullName: authUser.fullName,
      avatarUrl: avatarPreviewUrl ?? authUser.avatarUrl,
    }
  }, [authUser, avatarPreviewUrl])

  const handleAvatarChange = (file: File) => {
    setAvatarMessage(null)
    setAvatarError(null)

    const validationError = validateAvatarFile(file)
    if (validationError === 'invalidType') {
      setAvatarError(t(PROFILE_I18N.avatar.errors.invalidType))
      return
    }

    if (validationError === 'tooLarge') {
      setAvatarError(t(PROFILE_I18N.avatar.errors.tooLarge))
      return
    }

    if (avatarPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreviewUrl)
    }

    setAvatarPreviewUrl(URL.createObjectURL(file))
    avatarMutation.mutate(file)
  }

  const handleRemove = (hotelId: number) => {
    removeMutation.mutate(hotelId)
  }

  const savedPlacesContent = (() => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <Spin aria-label={t('common.loading')} />
        </div>
      )
    }

    if (isError) {
      return <p className={styles.empty}>{t(PROFILE_I18N.savedPlaces.loadError)}</p>
    }

    if (savedHotels.length === 0) {
      return <p className={styles.empty}>{t(PROFILE_I18N.savedPlaces.empty)}</p>
    }

    return (
      <div className={styles.grid}>
        {savedHotels.map((hotel) => (
          <SavedPlaceCard
            key={hotel.id}
            name={hotel.name}
            country={hotel.country}
            description={hotel.description}
            guestRating={hotel.averageRating ?? hotel.starRating}
            imageUrl={hotel.mainImageUrl}
            bookNowLabel={t(PROFILE_I18N.actions.bookNow)}
            planWithAiLabel={t(PROFILE_I18N.actions.planWithAi)}
            removeLabel={t(PROFILE_I18N.actions.removeSaved)}
            onBookNow={() => navigate(`/hotel/${hotel.id}`)}
            onPlanWithAi={() =>
              navigate(
                buildPlannerUrl({
                  exploration: resolveExplorationFromDestination(hotel.country),
                  destination: hotel.country.toLowerCase(),
                  hotelId: String(hotel.id),
                  hotelName: hotel.name,
                }),
              )
            }
            onRemove={() => handleRemove(hotel.id)}
          />
        ))}
      </div>
    )
  })()

  const tabItems = [
    {
      key: 'savedPlaces' as const,
      label: t(PROFILE_I18N.tabs.savedPlaces),
      children: savedPlacesContent,
    },
  ]

  if (!displayUser) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Spin aria-label={t('common.loading')} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <ProfileHeaderCard
        fullName={displayUser.fullName}
        avatarUrl={displayUser.avatarUrl}
        verifiedLabel={t(PROFILE_I18N.verified)}
        canEditAvatar={Boolean(authUser)}
        changeAvatarLabel={t(PROFILE_I18N.avatar.change)}
        isUploading={avatarMutation.isPending}
        onAvatarChange={handleAvatarChange}
      />

      {avatarError ? (
        <Alert className={styles.avatarAlert} type="error" message={avatarError} showIcon />
      ) : null}

      {avatarMessage ? (
        <Alert className={styles.avatarAlert} type="success" message={avatarMessage} showIcon />
      ) : null}

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as ProfileTab)}
        items={tabItems}
        className={styles.tabs}
      />
    </div>
  )
}

export default ProfilePage
