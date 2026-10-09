import { ChevronLeft, ChevronRight, SlidersHorizontal, TrainTrack } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import Button from '../components/atoms/Button'
import { buttonClasses } from '../components/atoms/buttonStyles'
import Card from '../components/atoms/Card'
import Select from '../components/atoms/Select'
import Alert from '../components/molecules/Alert'
import EmptyState from '../components/molecules/EmptyState'
import PageHeader from '../components/molecules/PageHeader'
import TrainResultsList from '../components/organisms/TrainResultsList'
import TrainSearchForm from '../components/organisms/TrainSearchForm'
import { ALL_CLASSES, WEEKDAY_SHORT } from '../config/constants'
import { stationName } from '../data/seedStations'
import { selectAllBookings } from '../features/bookings/bookingSelectors'
import { selectAllTrains } from '../features/trains/trainSelectors'
import type { Train } from '../features/trains/trainTypes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTrainSearch } from '../hooks/useTrainSearch'
import { searchTrains } from '../services/trainService'
import type { Quota, TravelClass } from '../types/common'
import { cn } from '../utils/cn'
import { addDays, formatJourneyDate, isPastDate, timeToMinutes } from '../utils/dateUtils'
import { searchSchema } from '../validation/schemas'

type TimeSlot = 'ANY' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'
type SortKey = 'departure' | 'duration' | 'fare'

const TIME_SLOTS: Record<Exclude<TimeSlot, 'ANY'>, { label: string; from: number; to: number }> = {
  MORNING: { label: 'Morning (6–12)', from: 360, to: 720 },
  AFTERNOON: { label: 'Afternoon (12–18)', from: 720, to: 1080 },
  EVENING: { label: 'Evening (18–24)', from: 1080, to: 1440 },
  NIGHT: { label: 'Night (0–6)', from: 0, to: 360 },
}

const cheapestFare = (train: Train) => Math.min(...train.classes.map((cls) => train.fares[cls] ?? Infinity))

export default function TrainResultsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const search = useTrainSearch()
  const allTrains = useAppSelector(selectAllTrains)
  const bookings = useAppSelector(selectAllBookings)

  const [showModify, setShowModify] = useState(false)
  const [classFilter, setClassFilter] = useState<TravelClass[]>([])
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('ANY')
  const [sortBy, setSortBy] = useState<SortKey>('departure')

  const parsed = searchSchema.safeParse({
    from: params.get('from') ?? '',
    to: params.get('to') ?? '',
    date: params.get('date') ?? '',
  })
  useDocumentTitle(parsed.success ? `${parsed.data.from} to ${parsed.data.to}` : 'Train results')

  if (!parsed.success) {
    return (
      <div className="space-y-4">
        <PageHeader title="Search results" breadcrumbs={[{ label: 'Search', to: '/customer/search' }, { label: 'Results' }]} />
        <Alert tone="warning" title="This search can't be shown">
          {parsed.error.issues[0]?.message ?? 'The search details are incomplete.'}
        </Alert>
        <Link to="/customer/search" className={buttonClasses('primary')}>
          Start a new search
        </Link>
      </div>
    )
  }

  const query = parsed.data
  const matches = searchTrains(allTrains, query)
  const routeTrains = allTrains.filter((train) => train.from === query.from && train.to === query.to)

  const visible = matches
    .filter((train) => classFilter.length === 0 || train.classes.some((cls) => classFilter.includes(cls)))
    .filter((train) => {
      if (timeSlot === 'ANY') return true
      const minutes = timeToMinutes(train.departure)
      return minutes >= TIME_SLOTS[timeSlot].from && minutes < TIME_SLOTS[timeSlot].to
    })
    .sort((a, b) => {
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes
      if (sortBy === 'fare') return cheapestFare(a) - cheapestFare(b)
      return a.departure.localeCompare(b.departure)
    })

  const toggleClass = (cls: TravelClass) =>
    setClassFilter((current) => (current.includes(cls) ? current.filter((c) => c !== cls) : [...current, cls]))

  const changeDate = (days: number) => search({ ...query, date: addDays(query.date, days) })

  const handleBook = (train: Train, travelClass: TravelClass, quota: Quota) => {
    const bookingParams = new URLSearchParams({ date: query.date, class: travelClass, quota })
    navigate(`/customer/book/${train.id}?${bookingParams.toString()}`)
  }

  const otherDays = [...new Set(routeTrains.flatMap((train) => train.runsOn))].sort().map((d) => WEEKDAY_SHORT[d])

  return (
    <div>
      <PageHeader
        title={`${stationName(query.from)} → ${stationName(query.to)}`}
        description={`${formatJourneyDate(query.date)} · ${matches.length} train${matches.length === 1 ? '' : 's'} found`}
        breadcrumbs={[{ label: 'Search', to: '/customer/search' }, { label: 'Results' }]}
        actions={
          <Button variant="secondary" onClick={() => setShowModify((open) => !open)} aria-expanded={showModify}>
            {showModify ? 'Close' : 'Modify search'}
          </Button>
        }
      />

      {showModify && (
        <Card className="mb-6 p-5">
          <TrainSearchForm
            key={`${query.from}-${query.to}-${query.date}`}
            defaultValues={query}
            onSearch={(values) => {
              setShowModify(false)
              search(values)
            }}
          />
        </Card>
      )}

      <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => changeDate(-1)}
          disabled={isPastDate(addDays(query.date, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Previous day</span>
        </Button>
        <span className="text-sm font-medium text-slate-900">{formatJourneyDate(query.date)}</span>
        <Button variant="ghost" size="sm" onClick={() => changeDate(1)} aria-label="Next day">
          <span className="hidden sm:inline">Next day</span>
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="space-y-5 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <SlidersHorizontal aria-hidden="true" className="size-4" /> Filters
            </p>

            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Class</legend>
              <div className="flex flex-wrap gap-2">
                {ALL_CLASSES.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleClass(cls)}
                    aria-pressed={classFilter.includes(cls)}
                    className={cn(
                      'rounded border px-2.5 py-1 text-xs font-semibold',
                      classFilter.includes(cls)
                        ? 'border-brand-600 bg-brand-700 text-white'
                        : 'border-slate-300 text-slate-700 hover:border-brand-300',
                    )}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="time-slot" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Departure time
              </label>
              <Select id="time-slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}>
                <option value="ANY">Any time</option>
                {Object.entries(TIME_SLOTS).map(([key, slot]) => (
                  <option key={key} value={key}>
                    {slot.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="sort-by" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sort by
              </label>
              <Select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
                <option value="departure">Departure time</option>
                <option value="duration">Shortest journey</option>
                <option value="fare">Lowest fare</option>
              </Select>
            </div>

            {(classFilter.length > 0 || timeSlot !== 'ANY') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setClassFilter([])
                  setTimeSlot('ANY')
                }}
              >
                Clear filters
              </Button>
            )}
          </Card>
        </aside>

        <section aria-label="Trains">
          {matches.length === 0 ? (
            <EmptyState
              icon={TrainTrack}
              title="No trains on this date"
              description={
                routeTrains.length > 0
                  ? `Trains on this route run on ${otherDays.join(', ')}. Try another date.`
                  : 'We could not find any direct trains between these stations.'
              }
              action={
                <Button variant="secondary" onClick={() => setShowModify(true)}>
                  Change search
                </Button>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={SlidersHorizontal}
              title="No trains match these filters"
              description="Try removing a class or time filter."
            />
          ) : (
            <TrainResultsList trains={visible} date={query.date} bookings={bookings} onBook={handleBook} />
          )}
        </section>
      </div>
    </div>
  )
}
