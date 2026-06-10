import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Button, DatePicker, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { BOOKING_GUEST_OPTIONS, BOOKING_I18N, parseGuestCount } from './const'
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
  checkIn,
  checkOut,
  guestSelection,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onBookNow,
  isSubmitting = false,
}: HotelBookingCardProps) => {
  const { t } = useTranslation()

  const handleBookNowClick = () => {
    if (!checkIn || !checkOut || isSubmitting) return

    void onBookNow?.({
      checkIn,
      checkOut,
      guestCount: parseGuestCount(guestSelection),
    })
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

        <div className={styles.pickerBox}>
          <div className={styles.pickerRow}>
            <div className={`${styles.pickerCell} ${styles.pickerCellBordered}`}>
              <span className={styles.label}>{t(BOOKING_I18N.checkIn)}</span>
              <DatePicker
                className={styles.picker}
                value={checkIn}
                onChange={onCheckInChange}
                format="MMM D"
                variant="borderless"
              />
            </div>
            <div className={styles.pickerCell}>
              <span className={styles.label}>{t(BOOKING_I18N.checkOut)}</span>
              <DatePicker
                className={styles.picker}
                value={checkOut}
                onChange={onCheckOutChange}
                format="MMM D"
                variant="borderless"
                disabledDate={(current) => (checkIn ? current.isBefore(checkIn, 'day') : false)}
              />
            </div>
          </div>
          <div className={styles.pickerCellFull}>
            <span className={styles.label}>{t(BOOKING_I18N.guests)}</span>
            <Select
              className={styles.picker}
              value={guestSelection}
              onChange={onGuestsChange}
              options={BOOKING_GUEST_OPTIONS.map((opt) => ({
                value: opt.value,
                label: t(opt.labelKey),
              }))}
              placeholder={t(BOOKING_I18N.guestsPlaceholder)}
              variant="borderless"
            />
          </div>
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

        <Button
          type="primary"
          className={styles.bookBtn}
          onClick={handleBookNowClick}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
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
