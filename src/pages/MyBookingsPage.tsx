import { Ticket } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { buttonClasses } from '../components/atoms/buttonStyles'
import EmptyState from '../components/molecules/EmptyState'
import PageHeader from '../components/molecules/PageHeader'
import SegmentedTabs from '../components/molecules/SegmentedTabs'
import BookingTable from '../components/organisms/BookingTable'
import { selectMyBookings } from '../features/bookings/bookingSelectors'
import type { Booking } from '../features/bookings/bookingTypes'
import { useCancelBooking } from '../hooks/useCancelBooking'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { isPastDate } from '../utils/dateUtils'

type Tab = 'UPCOMING' | 'PAST' | 'CANCELLED'

const filters: Record<Tab, (booking: Booking) => boolean> = {
  UPCOMING: (b) => b.status !== 'CANCELLED' && !isPastDate(b.journeyDate),
  PAST: (b) => b.status !== 'CANCELLED' && isPastDate(b.journeyDate),
  CANCELLED: (b) => b.status === 'CANCELLED',
}

const emptyText: Record<Tab, string> = {
  UPCOMING: 'You have no upcoming journeys.',
  PAST: 'Completed journeys will show up here.',
  CANCELLED: 'You have not cancelled any tickets.',
}

export default function MyBookingsPage() {
  useDocumentTitle('My bookings')
  const bookings = useAppSelector(selectMyBookings)
  const { cancelBooking, dialog } = useCancelBooking()
  const [tab, setTab] = useState<Tab>('UPCOMING')

  const visible = bookings.filter(filters[tab])

  return (
    <>
      <PageHeader title="My bookings" description="View tickets, check status and cancel upcoming journeys." />

      {bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="Once you book a ticket it will appear here with its PNR and status."
          action={
            <Link to="/customer/search" className={buttonClasses('primary')}>
              Book a ticket
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <SegmentedTabs
            label="Filter bookings"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'UPCOMING', label: 'Upcoming', count: bookings.filter(filters.UPCOMING).length },
              { value: 'PAST', label: 'Past', count: bookings.filter(filters.PAST).length },
              { value: 'CANCELLED', label: 'Cancelled', count: bookings.filter(filters.CANCELLED).length },
            ]}
          />
          {visible.length === 0 ? (
            <EmptyState icon={Ticket} title="Nothing here" description={emptyText[tab]} />
          ) : (
            <BookingTable bookings={visible} onCancel={cancelBooking} />
          )}
        </div>
      )}
      {dialog}
    </>
  )
}
