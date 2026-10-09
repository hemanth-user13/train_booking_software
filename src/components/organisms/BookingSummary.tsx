import { BERTH_LABELS, CLASS_LABELS, GENDER_LABELS, QUOTA_LABELS } from '../../config/constants'
import type { BookingPassenger, FareBreakdown as Fare, TrainSnapshot } from '../../features/bookings/bookingTypes'
import type { PassengerDetails } from '../../features/passengers/passengerTypes'
import type { Quota, TravelClass } from '../../types/common'
import { formatJourneyDate } from '../../utils/dateUtils'
import Card from '../atoms/Card'
import FareBreakdown from '../molecules/FareBreakdown'
import TrainSummary from '../molecules/TrainSummary'

interface BookingSummaryProps {
  train: TrainSnapshot
  journeyDate: string
  travelClass: TravelClass
  quota: Quota
  passengers: Array<PassengerDetails | BookingPassenger>
  fare: Fare
}

const hasSeat = (passenger: PassengerDetails | BookingPassenger): passenger is BookingPassenger => 'seat' in passenger

/** Full journey, passenger and fare overview. Used on the review step and on the ticket. */
export default function BookingSummary({ train, journeyDate, travelClass, quota, passengers, fare }: BookingSummaryProps) {
  const showSeats = passengers.some(hasSeat)

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold text-slate-900">
            <span className="mr-2 font-mono text-sm text-brand-700">{train.number}</span>
            {train.name}
          </h3>
          <p className="text-sm text-slate-600">{formatJourneyDate(journeyDate)}</p>
        </div>
        <TrainSummary train={train} journeyDate={journeyDate} />
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">Class</dt>
            <dd className="font-medium text-slate-900">
              {CLASS_LABELS[travelClass]} ({travelClass})
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Quota</dt>
            <dd className="font-medium text-slate-900">{QUOTA_LABELS[quota]}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Passengers</dt>
            <dd className="font-medium text-slate-900">{passengers.length}</dd>
          </div>
        </dl>
      </Card>

      <Card className="overflow-hidden">
        <h3 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 sm:px-5">Passengers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium sm:px-5">#</th>
                <th scope="col" className="px-4 py-2 font-medium">Name</th>
                <th scope="col" className="px-4 py-2 font-medium">Age</th>
                <th scope="col" className="px-4 py-2 font-medium">Gender</th>
                <th scope="col" className="px-4 py-2 font-medium">Preference</th>
                {showSeats && <th scope="col" className="px-4 py-2 font-medium">Seat / status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {passengers.map((passenger, index) => (
                <tr key={`${passenger.name}-${index}`}>
                  <td className="px-4 py-2.5 text-slate-500 sm:px-5">{index + 1}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-900">{passenger.name}</td>
                  <td className="px-4 py-2.5">{passenger.age}</td>
                  <td className="px-4 py-2.5">{GENDER_LABELS[passenger.gender]}</td>
                  <td className="px-4 py-2.5">{BERTH_LABELS[passenger.berth]}</td>
                  {showSeats && hasSeat(passenger) && (
                    <td className="px-4 py-2.5 font-mono font-medium text-slate-900">{passenger.seat}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Fare details</h3>
        <FareBreakdown fare={fare} />
      </Card>
    </div>
  )
}
