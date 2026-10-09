import { COACH_PREFIX, QUOTA_SHARE, SEATS_PER_COACH, WAITLIST_LIMIT } from '../config/constants'
import type { Booking } from '../features/bookings/bookingTypes'
import type { Availability, SearchQuery, Train } from '../features/trains/trainTypes'
import type { Quota, TravelClass } from '../types/common'
import { weekdayOf } from '../utils/dateUtils'

export function runsOnDate(train: Train, isoDate: string): boolean {
  return train.runsOn.includes(weekdayOf(isoDate))
}

export function searchTrains(trains: Train[], query: SearchQuery): Train[] {
  return trains
    .filter((train) => train.from === query.from && train.to === query.to && runsOnDate(train, query.date))
    .sort((a, b) => a.departure.localeCompare(b.departure))
}

/** Seats a class releases for one quota on a single journey date. */
export function quotaCapacity(train: Train, travelClass: TravelClass, quota: Quota): number {
  const total = train.seats[travelClass] ?? 0
  const tatkal = Math.floor(total * QUOTA_SHARE.TATKAL)
  const ladies = Math.floor(total * QUOTA_SHARE.LADIES)
  if (quota === 'TATKAL') return tatkal
  if (quota === 'LADIES') return ladies
  return total - tatkal - ladies
}

function activeBookingsFor(bookings: Booking[], trainId: string, date: string, travelClass: TravelClass) {
  return bookings.filter(
    (booking) =>
      booking.trainId === trainId &&
      booking.journeyDate === date &&
      booking.travelClass === travelClass &&
      booking.status !== 'CANCELLED',
  )
}

function countPassengers(bookings: Booking[]): number {
  return bookings.reduce((sum, booking) => sum + booking.passengers.length, 0)
}

/** Availability is always derived from bookings, so cancelling frees seats automatically. */
export function getAvailability(
  train: Train,
  travelClass: TravelClass,
  quota: Quota,
  date: string,
  bookings: Booking[],
): Availability {
  if (!train.classes.includes(travelClass)) {
    return { status: 'NOT_AVAILABLE', seatsLeft: 0, waitlistLeft: 0, nextWaitlistNumber: 0, bookableCount: 0, label: 'Not offered' }
  }

  const sameQuota = activeBookingsFor(bookings, train.id, date, travelClass).filter((b) => b.quota === quota)
  const confirmed = countPassengers(sameQuota.filter((b) => b.status === 'CONFIRMED'))
  const waitlisted = countPassengers(sameQuota.filter((b) => b.status === 'WAITLISTED'))

  const seatsLeft = Math.max(0, quotaCapacity(train, travelClass, quota) - confirmed)
  const waitlistLeft = Math.max(0, WAITLIST_LIMIT - waitlisted)
  const nextWaitlistNumber = waitlisted + 1

  if (seatsLeft > 0) {
    return { status: 'AVAILABLE', seatsLeft, waitlistLeft, nextWaitlistNumber, bookableCount: seatsLeft, label: `AVL ${seatsLeft}` }
  }
  if (waitlistLeft > 0) {
    return { status: 'WAITLIST', seatsLeft, waitlistLeft, nextWaitlistNumber, bookableCount: waitlistLeft, label: `WL ${nextWaitlistNumber}` }
  }
  return { status: 'NOT_AVAILABLE', seatsLeft, waitlistLeft, nextWaitlistNumber, bookableCount: 0, label: 'Regret' }
}

/** Gives each confirmed passenger a coach/berth like "B2/14". Numbering is shared across quotas. */
export function allocateSeats(
  train: Train,
  travelClass: TravelClass,
  date: string,
  bookings: Booking[],
  passengerCount: number,
): string[] {
  const alreadyConfirmed = countPassengers(
    activeBookingsFor(bookings, train.id, date, travelClass).filter((b) => b.status === 'CONFIRMED'),
  )
  return Array.from({ length: passengerCount }, (_, index) => {
    const seatNumber = alreadyConfirmed + index + 1
    const coach = Math.ceil(seatNumber / SEATS_PER_COACH)
    const berth = ((seatNumber - 1) % SEATS_PER_COACH) + 1
    return `${COACH_PREFIX[travelClass]}${coach}/${berth}`
  })
}
