import {
  CoffeeOutlined,
  HomeOutlined,
  StarOutlined,
  CompassOutlined,
  CloudOutlined,
} from '@ant-design/icons'
import type { HomeCategory, TrendingDestination } from './types'

export const HOME_I18N = {
  heroTitle: 'pages.home.heroTitle',
  search: {
    destination: 'pages.home.search.destination',
    destinationPlaceholder: 'pages.home.search.destinationPlaceholder',
    dates: 'pages.home.search.dates',
    datesPlaceholder: 'pages.home.search.datesPlaceholder',
    guests: 'pages.home.search.guests',
    guestsPlaceholder: 'pages.home.search.guestsPlaceholder',
    submit: 'pages.home.search.submit',
  },
  categories: {
    eyebrow: 'pages.home.categories.eyebrow',
    title: 'pages.home.categories.title',
    beaches: 'pages.home.categories.beaches',
    adventure: 'pages.home.categories.adventure',
    luxuryTour: 'pages.home.categories.luxuryTour',
    cabinStays: 'pages.home.categories.cabinStays',
    foodWine: 'pages.home.categories.foodWine',
  },
  trending: {
    eyebrow: 'pages.home.trending.eyebrow',
    title: 'pages.home.trending.title',
    avgPrice: 'pages.home.trending.avgPrice',
    prev: 'pages.home.trending.prev',
    next: 'pages.home.trending.next',
  },
} as const

export const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1534113414509-0d2d566ca03e?auto=format&fit=crop&w=1920&q=80'

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: 'beaches', labelKey: HOME_I18N.categories.beaches, icon: CloudOutlined },
  { id: 'adventure', labelKey: HOME_I18N.categories.adventure, icon: CompassOutlined },
  { id: 'luxury-tour', labelKey: HOME_I18N.categories.luxuryTour, icon: StarOutlined },
  { id: 'cabin-stays', labelKey: HOME_I18N.categories.cabinStays, icon: HomeOutlined },
  { id: 'food-wine', labelKey: HOME_I18N.categories.foodWine, icon: CoffeeOutlined },
]

export const TRENDING_DESTINATIONS: TrendingDestination[] = [
  {
    id: 'ubud',
    cityKey: 'pages.home.trending.destinations.ubud.city',
    countryKey: 'pages.home.trending.destinations.ubud.country',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    avgPrice: 50,
    cityQuery: 'Ubud',
  },
  {
    id: 'kyoto',
    cityKey: 'pages.home.trending.destinations.kyoto.city',
    countryKey: 'pages.home.trending.destinations.kyoto.country',
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e412f188?auto=format&fit=crop&w=600&q=80',
    avgPrice: 50,
    cityQuery: 'Kyoto',
  },
  {
    id: 'paris',
    cityKey: 'pages.home.trending.destinations.paris.city',
    countryKey: 'pages.home.trending.destinations.paris.country',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    avgPrice: 50,
    cityQuery: 'Paris',
  },
  {
    id: 'venice',
    cityKey: 'pages.home.trending.destinations.venice.city',
    countryKey: 'pages.home.trending.destinations.venice.country',
    imageUrl:
      'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80',
    avgPrice: 50,
    cityQuery: 'Venice',
  },
]
