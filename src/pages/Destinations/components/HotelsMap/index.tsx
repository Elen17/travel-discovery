import { useState, useMemo } from 'react'
import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Hotel } from '@/types/hotel'
import { formatCurrency } from '@/utils/currency'
import { getValidHotels, getMapViewState } from './utils'
import type { HotelsMapProps } from './types'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './styles.module.css'

export const HotelsMap = ({ hotels }: HotelsMapProps) => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

  const validHotels = useMemo(() => getValidHotels(hotels), [hotels])
  const viewState = useMemo(() => getMapViewState(validHotels), [validHotels])

  return (
    <div className={styles.mapWrapper}>
      <Map
        key={`${viewState.longitude}-${viewState.latitude}`}
        initialViewState={viewState}
        style={{ width: '100%', height: '420px' }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
      >
        {validHotels.map((hotel) => (
          <Marker
            key={hotel.id}
            longitude={hotel.longitude}
            latitude={hotel.latitude}
            anchor="bottom"
            onClick={() => setSelectedHotel(hotel)}
          />
        ))}

        {selectedHotel && (
          <Popup
            longitude={selectedHotel.longitude}
            latitude={selectedHotel.latitude}
            anchor="top"
            onClose={() => setSelectedHotel(null)}
            closeOnClick={false}
          >
            <div className={styles.popup}>
              <img
                src={selectedHotel.mainImageUrl}
                alt={selectedHotel.name}
                className={styles.popupImage}
              />
              <div className={styles.popupContent}>
                <p className={styles.popupName}>{selectedHotel.name}</p>
                <p className={styles.popupLocation}>
                  {selectedHotel.city}, {selectedHotel.country}
                </p>
                <p className={styles.popupPrice}>
                  {formatCurrency(selectedHotel.pricePerNight, 'USD', i18n.language)} / night
                </p>
                <button
                  className={styles.popupBtn}
                  onClick={() => navigate(`/hotel/${selectedHotel.id}`)}
                >
                  View Hotel
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
