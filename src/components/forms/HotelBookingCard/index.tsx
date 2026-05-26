import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Button, DatePicker, Select } from 'antd'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BOOKING_GUEST_OPTIONS, BOOKING_I18N } from './const'
import styles from './styles.module.css'
import type { HotelBookingCardProps } from './types'

export const HotelBookingCard = ({
  priceLabel,
  perNightLabel,
  nightsLineLabel,
  formattedSubtotal,
  formattedServiceFee,
  formattedTaxes,
  formattedTotal,
  defaultCheckIn,
  defaultCheckOut,
  onBookNow,
  onDatesChange,
}: HotelBookingCardProps) => {
  const { t } = useTranslation()
  const [checkIn, setCheckIn] = useState<Dayjs | null>(defaultCheckIn)
  const [checkOut, setCheckOut] = useState<Dayjs | null>(defaultCheckOut)

  const handleCheckInChange = (date: Dayjs | null) => {
    setCheckIn(date)
    onDatesChange?.(date, checkOut)
  }

  const handleCheckOutChange = (date: Dayjs | null) => {
    setCheckOut(date)
    onDatesChange?.(checkIn, date)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {priceLabel}
            <span className={styles.perNight}> {perNightLabel}</span>
          </span>
        </div>

        <div className={styles.dateRow}>
          <div className={styles.field}>
            <span className={styles.label}>{t(BOOKING_I18N.checkIn)}</span>
            <DatePicker
              className={styles.picker}
              value={checkIn}
              onChange={handleCheckInChange}
              format="MMM D"
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>{t(BOOKING_I18N.checkOut)}</span>
            <DatePicker
              className={styles.picker}
              value={checkOut}
              onChange={handleCheckOutChange}
              format="MMM D"
              disabledDate={(current) =>
                checkIn ? current.isBefore(checkIn, 'day') : false
              }
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>{t(BOOKING_I18N.guests)}</span>
          <Select
            className={styles.picker}
            defaultValue="2-1"
            options={BOOKING_GUEST_OPTIONS.map((opt) => ({
              value: opt.value,
              label: t(opt.labelKey),
            }))}
            placeholder={t(BOOKING_I18N.guestsPlaceholder)}
          />
        </div>

        <div className={styles.breakdown}>
          <div className={styles.line}>
            <span>{nightsLineLabel}</span>
            <span>{formattedSubtotal}</span>
          </div>
          <div className={styles.line}>
            <span>{t(BOOKING_I18N.serviceFee)}</span>
            <span>{formattedServiceFee}</span>
          </div>
          <div className={styles.line}>
            <span>{t(BOOKING_I18N.taxes)}</span>
            <span>{formattedTaxes}</span>
          </div>
          <div className={styles.totalLine}>
            <span>{t(BOOKING_I18N.total)}</span>
            <span>{formattedTotal}</span>
          </div>
        </div>

        <Button type="primary" className={styles.bookBtn} onClick={onBookNow}>
          {t(BOOKING_I18N.bookNow)}
        </Button>
        <span className={styles.notCharged}>{t(BOOKING_I18N.notCharged)}</span>
      </div>

      <div className={styles.trust}>
        <span className={styles.trustItem}>
          <LockOutlined className={styles.trustIcon} />
          {t(BOOKING_I18N.safeBooking)}
        </span>
        <span className={styles.trustItem}>
          <SafetyCertificateOutlined className={styles.trustIcon} />
          {t(BOOKING_I18N.freeCancellation)}
        </span>
      </div>
    </div>
  )
}
