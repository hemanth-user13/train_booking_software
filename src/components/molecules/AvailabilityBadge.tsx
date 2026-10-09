import type { Availability } from '../../features/trains/trainTypes'
import Badge, { type BadgeTone } from '../atoms/Badge'

const tone: Record<Availability['status'], BadgeTone> = {
  AVAILABLE: 'success',
  WAITLIST: 'warning',
  NOT_AVAILABLE: 'danger',
}

export default function AvailabilityBadge({ availability }: { availability: Availability }) {
  return <Badge tone={tone[availability.status]}>{availability.label}</Badge>
}
