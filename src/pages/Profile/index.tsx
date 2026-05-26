import { Tabs } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ProfileHeaderCard } from '@/components/common/ProfileHeaderCard'
import { SavedPlaceCard } from '@/components/common/SavedPlaceCard'
import { useAppSelector } from '@/store/hooks'
import { MOCK_PROFILE_USER, MOCK_SAVED_PLACES, PROFILE_I18N } from './const'
import styles from './styles.module.css'
import type { ProfileTab, SavedPlace } from './types'

const ProfilePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const authUser = useAppSelector((state) => state.auth.user)
  const [activeTab, setActiveTab] = useState<ProfileTab>('savedPlaces')
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(MOCK_SAVED_PLACES)

  const displayUser = useMemo(() => {
    if (authUser) {
      return {
        fullName: authUser.fullName,
        avatarUrl: authUser.avatarUrl ?? MOCK_PROFILE_USER.avatarUrl,
      }
    }
    return MOCK_PROFILE_USER
  }, [authUser])

  const handleRemove = (id: string) => {
    setSavedPlaces((prev) => prev.filter((place) => place.id !== id))
  }

  const tabItems = [
    {
      key: 'savedPlaces' as const,
      label: t(PROFILE_I18N.tabs.savedPlaces),
      children:
        savedPlaces.length === 0 ? (
          <p className={styles.empty}>{t('pages.profile.savedPlaces.empty')}</p>
        ) : (
          <div className={styles.grid}>
            {savedPlaces.map((place) => (
              <SavedPlaceCard
                key={place.id}
                name={place.name}
                country={t(place.countryKey)}
                description={t(place.descriptionKey)}
                guestRating={place.guestRating}
                imageUrl={place.imageUrl}
                bookNowLabel={t(PROFILE_I18N.actions.bookNow)}
                planWithAiLabel={t(PROFILE_I18N.actions.planWithAi)}
                removeLabel={t(PROFILE_I18N.actions.removeSaved)}
                onBookNow={() => navigate(`/hotel/${place.hotelId}`)}
                onPlanWithAi={() => navigate('/planner')}
                onRemove={() => handleRemove(place.id)}
              />
            ))}
          </div>
        ),
    },
  ]

  return (
    <div className={styles.page}>
      <ProfileHeaderCard
        fullName={displayUser.fullName}
        avatarUrl={displayUser.avatarUrl}
        verifiedLabel={t(PROFILE_I18N.verified)}
      />

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
