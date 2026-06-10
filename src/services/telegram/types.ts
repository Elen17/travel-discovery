export type TelegramResponse<T> = {
  ok: boolean
  result: T
  description?: string
  error_code?: number
}

export type TelegramUser = {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export type TelegramChat = {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  first_name?: string
  last_name?: string
  username?: string
  title?: string
}

export type TelegramMessage = {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
}

export type SendMessageRequest = {
  text: string
  chatId?: string
  parseMode?: string
}
