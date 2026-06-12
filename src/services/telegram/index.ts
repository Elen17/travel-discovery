import axios, { type AxiosError } from 'axios'
import type { SendMessageRequest, TelegramMessage, TelegramResponse } from './types'

const DEFAULT_TELEGRAM_API_BASE = import.meta.env.VITE_TELEGRAM_API_BASE?.trim();

export const isTelegramConfigured = (): boolean => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN?.trim()
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID?.trim()
  return Boolean(token && chatId)
}

const getBotToken = (): string => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN?.trim()
  if (!token) {
    throw new Error('Missing VITE_TELEGRAM_BOT_TOKEN')
  }
  return token
}

const getChatId = (): string => {
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID?.trim()
  if (!chatId) {
    throw new Error('Missing VITE_TELEGRAM_CHAT_ID')
  }
  return chatId
}

const getTelegramApiBase = (): string =>
  import.meta.env.VITE_TELEGRAM_URL?.trim() || DEFAULT_TELEGRAM_API_BASE

const telegramUrl = (method: string): string =>
  `${getTelegramApiBase()}${getBotToken()}/${method}`

const readErrorMessage = (
  err: AxiosError<TelegramResponse<unknown>>,
  fallback: string,
): string => err.response?.data?.description ?? fallback

export const sendMessage = async (
  args: SendMessageRequest & { signal?: AbortSignal },
): Promise<TelegramMessage | null> => {
  if (!isTelegramConfigured()) {
    return null
  }

  try {
    const { data } = await axios.post<TelegramResponse<TelegramMessage>>(
      telegramUrl('sendMessage'),
      {
        chat_id: args.chatId ?? getChatId(),
        text: args.text,
        parse_mode: args.parseMode ?? 'HTML',
      },
      { signal: args.signal },
    )
    return data.result
  } catch (err) {
    if (axios.isCancel(err)) {
      throw new DOMException('Aborted', 'AbortError')
    }
    throw new Error(
      readErrorMessage(err as AxiosError<TelegramResponse<unknown>>, 'sendMessage failed.'),
      { cause: err },
    )
  }
}
