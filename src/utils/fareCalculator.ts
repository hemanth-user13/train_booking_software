import { AC_CLASSES, FARE_RULES, REFUND_RULES } from '../config/constants'
import type { Booking, FareBreakdown } from '../features/bookings/bookingTypes'
import type { Quota, TravelClass } from '../types/common'

export function calculateFare(
  farePerPassenger: number,
  travelClass: TravelClass,
  quota: Quota,
  passengerCount: number,
): FareBreakdown {
  const baseFare = farePerPassenger * passengerCount
  const tatkalCharge = quota === 'TATKAL' ? Math.round(baseFare * FARE_RULES.tatkalSurchargeRate) : 0
  const reservationCharge = FARE_RULES.reservationFeePerPassenger[travelClass] * passengerCount
  const gst = AC_CLASSES.includes(travelClass)
    ? Math.round((baseFare + tatkalCharge) * FARE_RULES.gstRateOnAc)
    : 0
  const convenienceFee = passengerCount > 0 ? FARE_RULES.convenienceFee : 0

  return {
    passengerCount,
    baseFare,
    tatkalCharge,
    reservationCharge,
    gst,
    convenienceFee,
    total: baseFare + tatkalCharge + reservationCharge + gst + convenienceFee,
  }
}

/** Demo refund rule: total minus a per-passenger cancellation fee and the convenience fee. */
export function calculateRefund(booking: Booking): number {
  if (booking.status === 'WAITLISTED') {
    // Waitlisted tickets never got a seat, so only the convenience fee is kept.
    return booking.fare.total - booking.fare.convenienceFee
  }
  if (booking.quota === 'TATKAL' && !REFUND_RULES.tatkalRefundable) return 0

  const fee = REFUND_RULES.cancellationFeePerPassenger[booking.travelClass] * booking.passengers.length
  return Math.max(0, booking.fare.total - fee - booking.fare.convenienceFee)
}
