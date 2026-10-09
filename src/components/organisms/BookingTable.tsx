import { Link } from 'react-router-dom'
import type { Booking } from '../../features/bookings/bookingTypes'
import { canCancel } from '../../services/bookingService'
import { formatJourneyDate } from '../../utils/dateUtils'
import { formatINR } from '../../utils/format'
import Button from '../atoms/Button'
import { buttonClasses } from '../atoms/buttonStyles'
import Card from '../atoms/Card'
import BookingStatusBadge from '../molecules/BookingStatusBadge'

interface BookingTableProps {
  bookings: Booking[]
  onCancel: (booking: Booking) => void
}

function Actions({ booking, onCancel }: { booking: Booking; onCancel: (booking: Booking) => void }) {
  return (
    <div className="flex justify-end gap-2">
      <Link to={`/customer/booking-confirmation/${booking.id}`} className={buttonClasses('secondary', 'sm')}>
        View
      </Link>
      {canCancel(booking) && (
        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => onCancel(booking)}>
          Cancel
        </Button>
      )}
    </div>
  )
}

function Amount({ booking }: { booking: Booking }) {
  return (
    <>
      <span className="tabular-nums">{formatINR(booking.fare.total)}</span>
      {booking.status === 'CANCELLED' && booking.refundAmount !== undefined && (
        <span className="block text-xs text-slate-500">Refund {formatINR(booking.refundAmount)}</span>
      )}
    </>
  )
}

export default function BookingTable({ bookings, onCancel }: BookingTableProps) {
  return (
    <>
      {/* Desktop: table */}
      <Card className="hidden overflow-hidden md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">PNR</th>
              <th scope="col" className="px-4 py-3 font-medium">Train</th>
              <th scope="col" className="px-4 py-3 font-medium">Journey</th>
              <th scope="col" className="px-4 py-3 font-medium">Class</th>
              <th scope="col" className="px-4 py-3 font-medium">Amount</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="align-top">
                <td className="px-4 py-3 font-mono font-medium text-slate-900">{booking.pnr}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{booking.train.name}</p>
                  <p className="text-xs text-slate-500">{booking.train.number}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-900">
                    {booking.train.from} → {booking.train.to}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatJourneyDate(booking.journeyDate)} · {booking.train.departure}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {booking.travelClass}
                  <span className="block text-xs text-slate-500">{booking.passengers.length} pax</span>
                </td>
                <td className="px-4 py-3">
                  <Amount booking={booking} />
                </td>
                <td className="px-4 py-3">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-4 py-3">
                  <Actions booking={booking} onCancel={onCancel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile: cards */}
      <ul className="space-y-3 md:hidden">
        {bookings.map((booking) => (
          <li key={booking.id}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">{booking.train.name}</p>
                  <p className="font-mono text-xs text-slate-500">PNR {booking.pnr}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="mt-3 text-sm text-slate-700">
                {booking.train.from} → {booking.train.to} · {booking.travelClass} · {booking.passengers.length} pax
              </p>
              <p className="text-xs text-slate-500">
                {formatJourneyDate(booking.journeyDate)} · {booking.train.departure}
              </p>
              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">
                  <Amount booking={booking} />
                </p>
                <Actions booking={booking} onCancel={onCancel} />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
