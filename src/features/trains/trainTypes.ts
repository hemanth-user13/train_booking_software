import type { TravelClass } from '../../types/common'

export interface Train {
  id: string
  number: string
  name: string
  from: string
  to: string
  /** "HH:mm", 24 hour clock */
  departure: string
  arrival: string
  durationMinutes: number
  /** 0 = Sunday ... 6 = Saturday */
  runsOn: number[]
  classes: TravelClass[]
  fares: Partial<Record<TravelClass, number>>
  /** Seats released per class for each journey date. */
  seats: Partial<Record<TravelClass, number>>
  origin: 'SEED' | 'ADMIN'
}

export interface SearchQuery {
  from: string
  to: string
  date: string
}

export interface TrainsState {
  customTrains: Train[]
  lastSearch: SearchQuery | null
}

export type AvailabilityStatus = 'AVAILABLE' | 'WAITLIST' | 'NOT_AVAILABLE'

export interface Availability {
  status: AvailabilityStatus
  /** Confirmed seats left in this quota. */
  seatsLeft: number
  /** Waitlist slots left once seats run out. */
  waitlistLeft: number
  /** Next waitlist number a new passenger would get. */
  nextWaitlistNumber: number
  /** Most passengers that can be booked right now. */
  bookableCount: number
  label: string
}
