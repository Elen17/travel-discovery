export type SessionExpiredModalProps = {
  open: boolean
  email: string
  loading?: boolean
  errorMessage?: string | null
  onCancel: () => void
  onSubmit: (password: string) => void
}

export type SessionExpiredFormValues = {
  password: string
}
