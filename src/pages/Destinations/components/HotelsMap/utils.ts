import type { Hotel } from '@/types/hotel'

export const getValidHotels = (hotels: Hotel[]) =>
  hotels.filter((h) => h.latitude !== 0 && h.longitude !== 0)

export const getMapViewState = (hotels: Hotel[]) => {
  if (hotels.length === 0) {
    return { longitude: 20, latitude: 30, zoom: 2 }
  }

  const lats = hotels.map((h) => h.latitude)
  const lngs = hotels.map((h) => h.longitude)

  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2

  const spread = Math.max(
    Math.max(...lats) - Math.min(...lats),
    Math.max(...lngs) - Math.min(...lngs),
  )

  let zoom = 2
  if (spread < 0.1) zoom = 13
  else if (spread < 0.5) zoom = 11
  else if (spread < 2) zoom = 9
  else if (spread < 10) zoom = 6
  else if (spread < 40) zoom = 4

  return { longitude: centerLng, latitude: centerLat, zoom }
}
