import type { BookingDisplay, BookingTab } from './types'

export const BOOKINGS_I18N = {
  title: 'pages.bookings.title',
  tabs: {
    upcoming: 'pages.bookings.tabs.upcoming',
    past: 'pages.bookings.tabs.past',
    cancelled: 'pages.bookings.tabs.cancelled',
  },
  card: {
    dates: 'pages.bookings.card.dates',
    guestsRoom: 'pages.bookings.card.guestsRoom',
    getDirections: 'pages.bookings.card.getDirections',
    viewDetails: 'pages.bookings.card.viewDetails',
    status: {
      confirmed: 'pages.bookings.card.status.confirmed',
      pending: 'pages.bookings.card.status.pending',
      cancelled: 'pages.bookings.card.status.cancelled',
      completed: 'pages.bookings.card.status.completed',
    },
  },
  empty: 'pages.bookings.empty',
  cta: {
    title: 'pages.bookings.cta.title',
    description: 'pages.bookings.cta.description',
    button: 'pages.bookings.cta.button',
  },
} as const

export const BOOKING_TABS: BookingTab[] = ['upcoming', 'past', 'cancelled']

export const MOCK_BOOKINGS: BookingDisplay[] = [
  {
    id: 'booking-1',
    hotelId: 'palazzo-di-pietra',
    hotelName: 'Grand Palazzo Hotel',
    city: 'Amalfi',
    country: 'Italy',
    checkIn: '2024-10-12',
    checkOut: '2024-10-18',
    guestCount: 2,
    roomTypeKey: 'pages.bookings.items.grandPalazzo.roomType',
    imageUrl:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80',
    status: 'CONFIRMED',
    tab: 'upcoming',
  },
  {
    id: 'booking-2',
    hotelId: 'teal-waters-resort',
    hotelName: 'Teal Waters Resort',
    city: 'Malé',
    country: 'Maldives',
    checkIn: '2025-06-01',
    checkOut: '2025-06-08',
    guestCount: 2,
    roomTypeKey: 'pages.bookings.items.tealWaters.roomType',
    imageUrl:
      'https://images.unsplash.com/photo-1573843981267-be1999ffcd2b?auto=format&fit=crop&w=400&q=80',
    status: 'PENDING',
    tab: 'upcoming',
  },
  {
    id: 'booking-3',
    hotelId: 'azure-horizon-villa',
    hotelName: 'Azure Horizon Villa',
    city: 'Santorini',
    country: 'Greece',
    checkIn: '2024-03-10',
    checkOut: '2024-03-15',
    guestCount: 2,
    roomTypeKey: 'pages.bookings.items.azureHorizon.roomType',
    imageUrl:
      'https://images.unsplash.com/photo-1613395877344-13d4a461b9c3?auto=format&fit=crop&w=400&q=80',
    status: 'COMPLETED',
    tab: 'past',
  },
  {
    id: 'booking-4',
    hotelId: 'sage-enclave',
    hotelName: 'The Sage Enclave',
    city: 'Sedona',
    country: 'USA',
    checkIn: '2024-01-05',
    checkOut: '2024-01-09',
    guestCount: 1,
    roomTypeKey: 'pages.bookings.items.sageEnclave.roomType',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    status: 'CANCELLED',
    tab: 'cancelled',
  },
]

export const STATUS_LABEL_KEYS: Record<
  BookingDisplay['status'],
  string
> = {
  CONFIRMED: BOOKINGS_I18N.card.status.confirmed,
  PENDING: BOOKINGS_I18N.card.status.pending,
  CANCELLED: BOOKINGS_I18N.card.status.cancelled,
  COMPLETED: BOOKINGS_I18N.card.status.completed,
}
