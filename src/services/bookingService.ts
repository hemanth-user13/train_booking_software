import type { Booking, BookingPassenger } from '../features/bookings/bookingTypes'
import type { PassengerDetails } from '../features/passengers/passengerTypes'
import type { Train } from '../features/trains/trainTypes'
import type { Quota, TravelClass } from '../types/common'
import { isPastDate } from '../utils/dateUtils'
import { calculateFare } from '../utils/fareCalculator'
import { generatePNR } from '../utils/generatePNR'
import { allocateSeats, getAvailability } from './trainService'

interface BuildBookingInput {
  bookingId: string
  userId: string
  train: Train
  journeyDate: string
  travelClass: TravelClass
  quota: Quota
  passengers: PassengerDetails[]
  paymentLabel: string
  existingBookings: Booking[]
}

/**
 * Turns a paid checkout into a booking record. Returns an error string instead
 * if seats ran out while the customer was paying.
 */
export function buildBooking(input: BuildBookingInput): Booking | string {
  const { train, travelClass, quota, journeyDate, passengers, existingBookings } = input
  const availability = getAvailability(train, travelClass, quota, journeyDate, existingBookings)

  if (passengers.length === 0) return 'Add at least one passenger.'
  if (passengers.length > availability.bookableCount) {
    return `Only ${availability.bookableCount} ${availability.status === 'WAITLIST' ? 'waitlist slots' : 'seats'} are left.`
  }

  const isConfirmed = availability.status === 'AVAILABLE'
  const seats = isConfirmed
    ? allocateSeats(train, travelClass, journeyDate, existingBookings, passengers.length)
    : passengers.map((_, index) => `WL ${availability.nextWaitlistNumber + index}`)

  const bookingPassengers: BookingPassenger[] = passengers.map((passenger, index) => ({
    ...passenger,
    seat: seats[index],
  }))

  return {
    id: input.bookingId,
    pnr: generatePNR(existingBookings.map((booking) => booking.pnr)),
    userId: input.userId,
    trainId: train.id,
    train: {
      number: train.number,
      name: train.name,
      from: train.from,
      to: train.to,
      departure: train.departure,
      arrival: train.arrival,
      durationMinutes: train.durationMinutes,
    },
    journeyDate,
    travelClass,
    quota,
    passengers: bookingPassengers,
    fare: calculateFare(train.fares[travelClass] ?? 0, travelClass, quota, passengers.length),
    paymentLabel: input.paymentLabel,
    status: isConfirmed ? 'CONFIRMED' : 'WAITLISTED',
    createdAt: new Date().toISOString(),
  }
}

export function canCancel(booking: Booking): boolean {
  return booking.status !== 'CANCELLED' && !isPastDate(booking.journeyDate)
}
