export type AuthPageProps = Record<string, never>

export type AuthMode = 'login' | 'register'

export type LoginFormValues = {
  email: string
  password: string
}

export type RegisterFormValues = {
  fullName: string
  email: string
  password: string
}
