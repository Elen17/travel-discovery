import type { Dayjs } from 'dayjs'

export type HomeSearchBarProps = {
  onSearch?: (values: HomeSearchBarValues) => void | Promise<void>
  loading?: boolean
}

export type HomeSearchBarValues = {
  country: string | null
  city: string | null
  dates: [Dayjs, Dayjs] | null
  guests: number | null
}
