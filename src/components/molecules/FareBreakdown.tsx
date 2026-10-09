import type { FareBreakdown as Fare } from '../../features/bookings/bookingTypes'
import { formatINR } from '../../utils/format'

export default function FareBreakdown({ fare }: { fare: Fare }) {
  const rows: Array<[string, number]> = [
    [`Base fare (${fare.passengerCount} × passenger)`, fare.baseFare],
    ['Tatkal charge', fare.tatkalCharge],
    ['Reservation charge', fare.reservationCharge],
    ['GST', fare.gst],
    ['Convenience fee', fare.convenienceFee],
  ]

  return (
    <dl className="space-y-2 text-sm">
      {rows
        .filter(([, amount]) => amount > 0)
        .map(([label, amount]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-slate-600">{label}</dt>
            <dd className="tabular-nums text-slate-900">{formatINR(amount)}</dd>
          </div>
        ))}
      <div className="flex justify-between gap-4 border-t border-slate-200 pt-2 font-semibold">
        <dt className="text-slate-900">Total</dt>
        <dd className="tabular-nums text-slate-900">{formatINR(fare.total)}</dd>
      </div>
    </dl>
  )
}
