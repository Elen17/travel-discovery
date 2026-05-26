import type { Dayjs } from 'dayjs'

export type HomeSearchBarProps = {
  onSearch?: (values: HomeSearchBarValues) => void
}

export type HomeSearchBarValues = {
  destination: string
  dates: [Dayjs, Dayjs] | null
  guests: number | null
}
