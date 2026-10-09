import { stationName } from '../../data/seedStations'
import type { TrainSnapshot } from '../../features/bookings/bookingTypes'
import { addDays, arrivalDayOffset, formatDuration, formatJourneyDate } from '../../utils/dateUtils'

interface TrainSummaryProps {
  train: TrainSnapshot
  journeyDate?: string
}

/** Departure — duration — arrival row used on result cards, summaries and tickets. */
export default function TrainSummary({ train, journeyDate }: TrainSummaryProps) {
  const dayOffset = arrivalDayOffset(train.departure, train.durationMinutes)

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div>
        <p className="text-lg font-semibold text-slate-900 tabular-nums">{train.departure}</p>
        <p className="text-sm text-slate-700">
          {stationName(train.from)} <span className="text-slate-400">({train.from})</span>
        </p>
        {journeyDate && <p className="text-xs text-slate-500">{formatJourneyDate(journeyDate)}</p>}
      </div>

      <div className="flex min-w-20 flex-col items-center text-xs text-slate-500">
        <span>{formatDuration(train.durationMinutes)}</span>
        <span className="my-1 h-px w-full bg-slate-300" aria-hidden="true" />
        {dayOffset > 0 && <span>+{dayOffset} day</span>}
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold text-slate-900 tabular-nums">{train.arrival}</p>
        <p className="text-sm text-slate-700">
          {stationName(train.to)} <span className="text-slate-400">({train.to})</span>
        </p>
        {journeyDate && <p className="text-xs text-slate-500">{formatJourneyDate(addDays(journeyDate, dayOffset))}</p>}
      </div>
    </div>
  )
}
