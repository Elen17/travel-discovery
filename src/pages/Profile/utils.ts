import { AVATAR_MAX_SIZE_BYTES } from './const'

export const validateAvatarFile = (file: File): 'invalidType' | 'tooLarge' | null => {
  if (!file.type.startsWith('image/')) {
    return 'invalidType'
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return 'tooLarge'
  }

  return null
}
