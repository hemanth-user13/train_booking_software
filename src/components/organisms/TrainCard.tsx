import { useState } from 'react'
import { CLASS_LABELS, QUOTA_LABELS, QUOTAS } from '../../config/constants'
import type { Booking } from '../../features/bookings/bookingTypes'
import type { Train } from '../../features/trains/trainTypes'
import { getAvailability } from '../../services/trainService'
import type { Quota, TravelClass } from '../../types/common'
import { cn } from '../../utils/cn'
import { formatINR } from '../../utils/format'
import Button from '../atoms/Button'
import Card from '../atoms/Card'
import AvailabilityBadge from '../molecules/AvailabilityBadge'
import RunningDays from '../molecules/RunningDays'
import SegmentedTabs from '../molecules/SegmentedTabs'
import TrainSummary from '../molecules/TrainSummary'

interface TrainCardProps {
  train: Train
  date: string
  bookings: Booking[]
  onBook: (travelClass: TravelClass, quota: Quota) => void
}

const availabilityText = {
  AVAILABLE: 'Seats available. Your berth is confirmed once payment goes through.',
  WAITLIST: 'Seats are full. You can book on the waitlist and will get a WL number.',
  NOT_AVAILABLE: 'No seats or waitlist slots left in this class and quota.',
}

export default function TrainCard({ train, date, bookings, onBook }: TrainCardProps) {
  const [selectedClass, setSelectedClass] = useState<TravelClass | null>(null)
  const [quota, setQuota] = useState<Quota>('GENERAL')

  const selected = selectedClass ? getAvailability(train, selectedClass, quota, date, bookings) : null

  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900">
            <span className="mr-2 font-mono text-sm text-brand-700">{train.number}</span>
            {train.name}
          </h3>
          <RunningDays runsOn={train.runsOn} />
        </div>

        <TrainSummary train={train} />

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={`Classes on ${train.name}`}>
          {train.classes.map((cls) => {
            const availability = getAvailability(train, cls, quota, date, bookings)
            const isSelected = cls === selectedClass
            return (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(isSelected ? null : cls)}
                aria-pressed={isSelected}
                className={cn(
                  'min-w-32 shrink-0 rounded-md border px-3 py-2 text-left transition-colors',
                  isSelected ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-slate-200 hover:border-brand-300',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{cls}</span>
                  <span className="text-sm tabular-nums text-slate-700">{formatINR(train.fares[cls] ?? 0)}</span>
                </span>
                <span className="mt-1 block">
                  <AvailabilityBadge availability={availability} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedClass && selected && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-900">
                {CLASS_LABELS[selectedClass]} ({selectedClass})
              </p>
              <SegmentedTabs
                label="Quota"
                value={quota}
                onChange={setQuota}
                tabs={QUOTAS.map((q) => ({ value: q, label: QUOTA_LABELS[q] }))}
              />
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <AvailabilityBadge availability={selected} />
                {availabilityText[selected.status]}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
              <p className="text-sm text-slate-600">
                <span className="text-lg font-semibold text-slate-900">{formatINR(train.fares[selectedClass] ?? 0)}</span> per
                passenger
              </p>
              <Button disabled={selected.status === 'NOT_AVAILABLE'} onClick={() => onBook(selectedClass, quota)}>
                {selected.status === 'WAITLIST' ? 'Book on waitlist' : 'Book now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
