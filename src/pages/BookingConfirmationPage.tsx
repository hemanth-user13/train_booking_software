import { CircleCheck, Clock, Printer, Ticket, CircleX } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import Button from '../components/atoms/Button'
import { buttonClasses } from '../components/atoms/buttonStyles'
import Card from '../components/atoms/Card'
import BookingStatusBadge from '../components/molecules/BookingStatusBadge'
import EmptyState from '../components/molecules/EmptyState'
import PageHeader from '../components/molecules/PageHeader'
import BookingSummary from '../components/organisms/BookingSummary'
import { selectCurrentUser } from '../features/auth/authSelectors'
import { selectBookingById } from '../features/bookings/bookingSelectors'
import type { BookingStatus } from '../features/bookings/bookingTypes'
import { useCancelBooking } from '../hooks/useCancelBooking'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { canCancel } from '../services/bookingService'
import { cn } from '../utils/cn'
import { formatDateTime } from '../utils/dateUtils'
import { formatINR } from '../utils/format'

const banner: Record<BookingStatus, { icon: typeof CircleCheck; title: string; text: string; className: string }> = {
  CONFIRMED: {
    icon: CircleCheck,
    title: 'Your ticket is confirmed',
    text: 'Berths are allotted below. Carry a valid photo ID while travelling.',
    className: 'border-green-200 bg-green-50 text-green-900',
  },
  WAITLISTED: {
    icon: Clock,
    title: 'You are on the waitlist',
    text: 'Your ticket is booked with a waitlist number. Cancel any time before departure for a near-full refund.',
    className: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  CANCELLED: {
    icon: CircleX,
    title: 'This ticket was cancelled',
    text: 'The refund goes back to the original payment method.',
    className: 'border-slate-200 bg-slate-100 text-slate-800',
  },
}

export default function BookingConfirmationPage() {
  const { bookingId } = useParams()
  const user = useAppSelector(selectCurrentUser)
  const booking = useAppSelector((state) => selectBookingById(state, bookingId))
  const { cancelBooking, dialog } = useCancelBooking()
  useDocumentTitle(booking ? `PNR ${booking.pnr}` : 'Booking')

  if (!booking || booking.userId !== user?.id) {
    return (
      <EmptyState
        icon={Ticket}
        title="Booking not found"
        description="This ticket doesn't exist or belongs to another account."
        action={
          <Link to="/customer/bookings" className={buttonClasses('primary')}>
            Go to my bookings
          </Link>
        }
      />
    )
  }

  const status = banner[booking.status]
  const StatusIcon = status.icon

  return (
    <>
      <PageHeader
        title="Booking details"
        breadcrumbs={[{ label: 'My bookings', to: '/customer/bookings' }, { label: `PNR ${booking.pnr}` }]}
        actions={
          <>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer aria-hidden="true" className="size-4" /> Print
            </Button>
            {canCancel(booking) && (
              <Button variant="danger" onClick={() => cancelBooking(booking)}>
                Cancel ticket
              </Button>
            )}
          </>
        }
      />

      <div className={cn('mb-6 flex gap-3 rounded-lg border p-4', status.className)} role="status">
        <StatusIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">{status.title}</p>
          <p className="text-sm opacity-90">{status.text}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <BookingSummary
          train={booking.train}
          journeyDate={booking.journeyDate}
          travelClass={booking.travelClass}
          quota={booking.quota}
          passengers={booking.passengers}
          fare={booking.fare}
        />

        <Card className="h-fit p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">PNR number</p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-wider text-slate-900">{booking.pnr}</p>
          <div className="mt-2">
            <BookingStatusBadge status={booking.status} />
          </div>
          <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Total paid</dt>
              <dd className="font-medium text-slate-900">{formatINR(booking.fare.total)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Paid with</dt>
              <dd className="text-slate-900">{booking.paymentLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Booked on</dt>
              <dd className="text-slate-900">{formatDateTime(booking.createdAt)}</dd>
            </div>
            {booking.status === 'CANCELLED' && (
              <>
                <div>
                  <dt className="text-xs text-slate-500">Cancelled on</dt>
                  <dd className="text-slate-900">{booking.cancelledAt ? formatDateTime(booking.cancelledAt) : '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Refund</dt>
                  <dd className="font-medium text-green-800">{formatINR(booking.refundAmount ?? 0)}</dd>
                </div>
              </>
            )}
          </dl>
          <div className="no-print mt-5 flex flex-col gap-2">
            <Link to="/customer/search" className={buttonClasses('primary', 'md', 'w-full')}>
              Book another ticket
            </Link>
            <Link to="/customer/bookings" className={buttonClasses('secondary', 'md', 'w-full')}>
              All bookings
            </Link>
          </div>
        </Card>
      </div>
      {dialog}
    </>
  )
}
