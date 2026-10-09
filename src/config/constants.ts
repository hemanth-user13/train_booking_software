import type { BerthPreference, Gender, Quota, TravelClass } from '../types/common'

/** Every key is prefixed so the app never collides with other data on the same origin. */
export const STORAGE_KEYS = {
  users: 'railway_users',
  session: 'railway_session',
  trains: 'railway_trains',
  passengers: 'railway_passengers',
  paymentMethods: 'railway_payment_methods',
  bookings: 'railway_bookings',
} as const

/** Bump this when a stored shape changes; older data is then ignored instead of crashing the app. */
export const STORAGE_VERSION = 1

export const ALL_CLASSES: TravelClass[] = ['SL', '3A', '2A', '1A', 'CC', 'EC']

export const CLASS_LABELS: Record<TravelClass, string> = {
  SL: 'Sleeper',
  '3A': 'AC 3 Tier',
  '2A': 'AC 2 Tier',
  '1A': 'AC First Class',
  CC: 'AC Chair Car',
  EC: 'Executive Chair Car',
}

export const QUOTAS: Quota[] = ['GENERAL', 'TATKAL', 'LADIES']

export const QUOTA_LABELS: Record<Quota, string> = {
  GENERAL: 'General',
  TATKAL: 'Tatkal',
  LADIES: 'Ladies',
}

/** Share of a class's daily seats set aside for each quota. General gets whatever is left. */
export const QUOTA_SHARE: Record<Exclude<Quota, 'GENERAL'>, number> = {
  TATKAL: 0.15,
  LADIES: 0.05,
}

export const WAITLIST_LIMIT = 10
export const MAX_PASSENGERS_PER_BOOKING = 6

export const FARE_RULES = {
  reservationFeePerPassenger: { SL: 20, '3A': 40, '2A': 50, '1A': 60, CC: 40, EC: 60 } as Record<TravelClass, number>,
  tatkalSurchargeRate: 0.3,
  gstRateOnAc: 0.05,
  convenienceFee: 15,
}

export const AC_CLASSES: TravelClass[] = ['3A', '2A', '1A', 'CC', 'EC']

export const REFUND_RULES = {
  cancellationFeePerPassenger: { SL: 60, '3A': 180, '2A': 200, '1A': 240, CC: 180, EC: 240 } as Record<TravelClass, number>,
  /** Confirmed Tatkal tickets are non-refundable, as on real reservation systems. */
  tatkalRefundable: false,
}

export const COACH_PREFIX: Record<TravelClass, string> = { SL: 'S', '3A': 'B', '2A': 'A', '1A': 'H', CC: 'C', EC: 'E' }
export const SEATS_PER_COACH = 64

export const GENDER_LABELS: Record<Gender, string> = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other' }

export const BERTH_LABELS: Record<BerthPreference, string> = {
  NONE: 'No preference',
  LOWER: 'Lower',
  MIDDLE: 'Middle',
  UPPER: 'Upper',
  SIDE_LOWER: 'Side lower',
  SIDE_UPPER: 'Side upper',
}

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const PAYMENT_DELAY_MS = 1500
