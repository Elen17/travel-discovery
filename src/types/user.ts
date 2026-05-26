export type User = {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  homeCountry: string | null
  currency: string
  language: string
}

export type AuthTokens = {
  accessToken: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  password: string
  fullName: string
}
