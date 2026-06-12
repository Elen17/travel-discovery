export const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024

export const PROFILE_I18N = {
  verified: 'pages.profile.verified',
  logout: 'pages.profile.logout',
  tabs: {
    savedPlaces: 'pages.profile.tabs.savedPlaces',
  },
  actions: {
    bookNow: 'pages.profile.actions.bookNow',
    planWithAi: 'pages.profile.actions.planWithAi',
    removeSaved: 'pages.profile.actions.removeSaved',
  },
  savedPlaces: {
    empty: 'pages.profile.savedPlaces.empty',
    loadError: 'pages.profile.savedPlaces.loadError',
  },
  avatar: {
    change: 'pages.profile.avatar.change',
    uploading: 'pages.profile.avatar.uploading',
    success: 'pages.profile.avatar.success',
    errors: {
      invalidType: 'pages.profile.avatar.errors.invalidType',
      tooLarge: 'pages.profile.avatar.errors.tooLarge',
      generic: 'pages.profile.avatar.errors.generic',
    },
  },
} as const
