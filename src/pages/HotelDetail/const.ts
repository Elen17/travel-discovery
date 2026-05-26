import {
  CoffeeOutlined,
  FireOutlined,
  SkinOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { MOCK_LISTINGS } from '@/pages/Destinations/const'
import type { HotelDetailData } from './types'

export const HOTEL_DETAIL_I18N = {
  reviewsCount: 'pages.hotelDetail.reviewsCount',
  descriptionTitle: 'pages.hotelDetail.descriptionTitle',
  amenitiesTitle: 'pages.hotelDetail.amenitiesTitle',
  galleryTitle: 'pages.hotelDetail.galleryTitle',
  galleryViewAll: 'pages.hotelDetail.galleryViewAll',
  reviewsTitle: 'pages.hotelDetail.reviewsTitle',
  reviewsSummary: 'pages.hotelDetail.reviewsSummary',
  reviewsExceptional: 'pages.hotelDetail.reviewsExceptional',
  notFound: 'pages.hotelDetail.notFound',
  booking: {
    perNight: 'pages.hotelDetail.booking.perNight',
    checkIn: 'pages.hotelDetail.booking.checkIn',
    checkOut: 'pages.hotelDetail.booking.checkOut',
    guests: 'pages.hotelDetail.booking.guests',
    guestsPlaceholder: 'pages.hotelDetail.booking.guestsPlaceholder',
    nightsLine: 'pages.hotelDetail.booking.nightsLine',
    serviceFee: 'pages.hotelDetail.booking.serviceFee',
    taxes: 'pages.hotelDetail.booking.taxes',
    total: 'pages.hotelDetail.booking.total',
    bookNow: 'pages.hotelDetail.booking.bookNow',
    notCharged: 'pages.hotelDetail.booking.notCharged',
    safeBooking: 'pages.hotelDetail.booking.safeBooking',
    freeCancellation: 'pages.hotelDetail.booking.freeCancellation',
  },
  weather: {
    sunny: 'pages.hotelDetail.weather.sunny',
  },
  amenities: {
    infinityPool: 'pages.hotelDetail.amenities.infinityPool',
    oceanSpa: 'pages.hotelDetail.amenities.oceanSpa',
    michelinDining: 'pages.hotelDetail.amenities.michelinDining',
    yogaStudio: 'pages.hotelDetail.amenities.yogaStudio',
  },
} as const

export const GUEST_OPTIONS = [
  { value: '2-0', labelKey: 'pages.hotelDetail.booking.guestOption2Adults' },
  { value: '2-1', labelKey: 'pages.hotelDetail.booking.guestOption2Adults1Child' },
  { value: '1-0', labelKey: 'pages.hotelDetail.booking.guestOption1Adult' },
] as const

const DEFAULT_AMENITIES: HotelDetailData['amenities'] = [
  { id: 'pool', labelKey: HOTEL_DETAIL_I18N.amenities.infinityPool, icon: ThunderboltOutlined },
  { id: 'spa', labelKey: HOTEL_DETAIL_I18N.amenities.oceanSpa, icon: SkinOutlined },
  { id: 'dining', labelKey: HOTEL_DETAIL_I18N.amenities.michelinDining, icon: CoffeeOutlined },
  { id: 'yoga', labelKey: HOTEL_DETAIL_I18N.amenities.yogaStudio, icon: FireOutlined },
]

const buildDetailFromListing = (
  listing: (typeof MOCK_LISTINGS)[number],
  overrides: Partial<HotelDetailData> = {},
): HotelDetailData => ({
  id: listing.id,
  name: listing.name,
  city: listing.city,
  country: listing.country,
  heroImageUrl: listing.imageUrl,
  guestRating: listing.guestRating,
  reviewCount: 428,
  pricePerNight: listing.pricePerNight,
  weatherTemp: 18,
  weatherConditionKey: HOTEL_DETAIL_I18N.weather.sunny,
  descriptionTitleKey: 'pages.hotelDetail.descriptions.default.title',
  descriptionParagraphKeys: [
    'pages.hotelDetail.descriptions.default.p1',
    'pages.hotelDetail.descriptions.default.p2',
  ],
  amenities: DEFAULT_AMENITIES,
  gallery: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      altKey: 'pages.hotelDetail.gallery.bedroom',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      altKey: 'pages.hotelDetail.gallery.cocktail',
    },
  ],
  galleryTotalPhotos: 42,
  reviews: [
    {
      id: '1',
      initials: 'EH',
      authorKey: 'pages.hotelDetail.reviews.eh.author',
      dateKey: 'pages.hotelDetail.reviews.eh.date',
      rating: 5,
      commentKey: 'pages.hotelDetail.reviews.eh.comment',
    },
    {
      id: '2',
      initials: 'JM',
      authorKey: 'pages.hotelDetail.reviews.jm.author',
      dateKey: 'pages.hotelDetail.reviews.jm.date',
      rating: 5,
      commentKey: 'pages.hotelDetail.reviews.jm.comment',
    },
  ],
  serviceFee: 120,
  occupancyTaxRate: 0.12,
  defaultNights: 6,
  ...overrides,
})

export const MOCK_HOTEL_DETAILS: Record<string, HotelDetailData> = Object.fromEntries(
  MOCK_LISTINGS.map((listing) => {
    if (listing.id === 'azure-horizon-villa') {
      return [
        listing.id,
        buildDetailFromListing(listing, {
          name: 'Azure Sands Boutique Resort',
          city: 'Amalfi Coast',
          country: 'Italy',
          heroImageUrl:
            'https://images.unsplash.com/photo-1573843981267-be1999ffcd2b?auto=format&fit=crop&w=1400&q=80',
          guestRating: 5.0,
          pricePerNight: 850,
          descriptionTitleKey: 'pages.hotelDetail.descriptions.coastal.title',
          descriptionParagraphKeys: [
            'pages.hotelDetail.descriptions.coastal.p1',
            'pages.hotelDetail.descriptions.coastal.p2',
          ],
        }),
      ]
    }
    return [listing.id, buildDetailFromListing(listing)]
  }),
)
