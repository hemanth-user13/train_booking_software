import type { Quota, TravelClass } from '../../types/common'
import type { PassengerDetails } from '../passengers/passengerTypes'

export type BookingStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED'

export interface BookingPassenger extends PassengerDetails {
  /** "B1/23" for a confirmed berth or "WL 4" for a waitlisted passenger. */
  seat: string
}

export interface FareBreakdown {
  passengerCount: number
  baseFare: number
  tatkalCharge: number
  reservationCharge: number
  gst: number
  convenienceFee: number
  total: number
}

/** Copy of the train at booking time, so history survives if an admin edits or deletes the train. */
export interface TrainSnapshot {
  number: string
  name: string
  from: string
  to: string
  departure: string
  arrival: string
  durationMinutes: number
}

export interface Booking {
  id: string
  pnr: string
  userId: string
  trainId: string
  train: TrainSnapshot
  journeyDate: string
  travelClass: TravelClass
  quota: Quota
  passengers: BookingPassenger[]
  fare: FareBreakdown
  paymentLabel: string
  status: BookingStatus
  createdAt: string
  cancelledAt?: string
  refundAmount?: number
}

export interface BookingsState {
  items: Booking[]
}
