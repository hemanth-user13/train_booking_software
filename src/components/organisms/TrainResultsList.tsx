import type { Booking } from '../../features/bookings/bookingTypes'
import type { Train } from '../../features/trains/trainTypes'
import type { Quota, TravelClass } from '../../types/common'
import TrainCard from './TrainCard'

interface TrainResultsListProps {
  trains: Train[]
  date: string
  bookings: Booking[]
  onBook: (train: Train, travelClass: TravelClass, quota: Quota) => void
}

export default function TrainResultsList({ trains, date, bookings, onBook }: TrainResultsListProps) {
  return (
    <ul className="space-y-4">
      {trains.map((train) => (
        <li key={train.id}>
          <TrainCard
            train={train}
            date={date}
            bookings={bookings}
            onBook={(travelClass, quota) => onBook(train, travelClass, quota)}
          />
        </li>
      ))}
    </ul>
  )
}
