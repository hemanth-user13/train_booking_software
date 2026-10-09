import type { BookingStatus } from '../../features/bookings/bookingTypes'
import Badge, { type BadgeTone } from '../atoms/Badge'

const config: Record<BookingStatus, { tone: BadgeTone; label: string }> = {
  CONFIRMED: { tone: 'success', label: 'Confirmed' },
  WAITLISTED: { tone: 'warning', label: 'Waitlisted' },
  CANCELLED: { tone: 'neutral', label: 'Cancelled' },
}

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={config[status].tone}>{config[status].label}</Badge>
}
