import {
  CarOutlined,
  CoffeeOutlined,
  HomeOutlined,
  RiseOutlined,
  SunOutlined,
} from '@ant-design/icons'
import type { HomeCategory } from './types'

export const TRENDING_HOTELS_QUERY_KEY = ['home', 'trending-hotels'] as const
export const TRENDING_HOTELS_LIMIT = 8
export const TRENDING_MIN_STAR_RATING = 4

export const HOME_I18N = {
  heroTitle: 'pages.home.heroTitle',
  search: {
    country: 'pages.home.search.country',
    countryPlaceholder: 'pages.home.search.countryPlaceholder',
    city: 'pages.home.search.city',
    cityPlaceholder: 'pages.home.search.cityPlaceholder',
    dates: 'pages.home.search.dates',
    startDatesPlaceholder: 'pages.home.search.startDatesPlaceholder',
    endDatesPlaceholder: 'pages.home.search.endDatesPlaceholder',
    guests: 'pages.home.search.guests',
    guestsPlaceholder: 'pages.home.search.guestsPlaceholder',
    submit: 'pages.home.search.submit',
    errors: {
      countryRequired: 'pages.home.search.errors.countryRequired',
      cityRequired: 'pages.home.search.errors.cityRequired',
      generic: 'pages.home.search.errors.generic',
    },
  },
  categories: {
    eyebrow: 'pages.home.categories.eyebrow',
    title: 'pages.home.categories.title',
    beaches: 'pages.home.categories.beaches',
    adventure: 'pages.home.categories.adventure',
    europeTour: 'pages.home.categories.europeTour',
    cabinStays: 'pages.home.categories.cabinStays',
    foodWine: 'pages.home.categories.foodWine',
  },
  trending: {
    eyebrow: 'pages.home.trending.eyebrow',
    title: 'pages.home.trending.title',
    avgPrice: 'pages.home.trending.avgPrice',
    prev: 'pages.home.trending.prev',
    next: 'pages.home.trending.next',
    cardAlt: 'pages.home.trending.cardAlt',
    loadError: 'pages.home.trending.loadError',
  },
} as const

export const HERO_IMAGE_URL = 'https://i.postimg.cc/TPYfkhLk/b8a00a19-9737-4e4a-b00b-01d61df9c72f.png'

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: 'beaches', labelKey: HOME_I18N.categories.beaches, icon: SunOutlined },
  { id: 'adventure', labelKey: HOME_I18N.categories.adventure, icon: RiseOutlined },
  { id: 'europe-tour', labelKey: HOME_I18N.categories.europeTour, icon: CarOutlined },
  { id: 'cabin-stays', labelKey: HOME_I18N.categories.cabinStays, icon: HomeOutlined },
  { id: 'food-wine', labelKey: HOME_I18N.categories.foodWine, icon: CoffeeOutlined },
]
