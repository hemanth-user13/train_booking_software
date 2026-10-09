import { CLASS_LABELS, QUOTA_LABELS, QUOTAS } from '../../config/constants'
import type { Booking } from '../../features/bookings/bookingTypes'
import type { Train } from '../../features/trains/trainTypes'
import { getAvailability } from '../../services/trainService'
import type { Quota, TravelClass } from '../../types/common'
import { cn } from '../../utils/cn'
import { todayISO } from '../../utils/dateUtils'
import { formatINR } from '../../utils/format'
import Input from '../atoms/Input'
import AvailabilityBadge from '../molecules/AvailabilityBadge'
import FormField from '../molecules/FormField'
import SegmentedTabs from '../molecules/SegmentedTabs'

interface ClassQuotaStepProps {
  train: Train
  bookings: Booking[]
  journeyDate: string
  travelClass: TravelClass
  quota: Quota
  dateError?: string
  onDateChange: (date: string) => void
  onClassChange: (travelClass: TravelClass) => void
  onQuotaChange: (quota: Quota) => void
}

export default function ClassQuotaStep({
  train,
  bookings,
  journeyDate,
  travelClass,
  quota,
  dateError,
  onDateChange,
  onClassChange,
  onQuotaChange,
}: ClassQuotaStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Journey date" htmlFor="journey-date" error={dateError}>
          <Input
            id="journey-date"
            type="date"
            min={todayISO()}
            value={journeyDate}
            invalid={!!dateError}
            aria-describedby="journey-date-msg"
            onChange={(e) => onDateChange(e.target.value)}
          />
        </FormField>
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Quota</p>
          <SegmentedTabs
            label="Quota"
            value={quota}
            onChange={onQuotaChange}
            tabs={QUOTAS.map((q) => ({ value: q, label: QUOTA_LABELS[q] }))}
          />
        </div>
      </div>

      {quota === 'TATKAL' && (
        <p className="text-xs text-slate-500">Tatkal adds a 30% surcharge and is non-refundable once confirmed.</p>
      )}
      {quota === 'LADIES' && <p className="text-xs text-slate-500">Ladies quota is for female passengers only.</p>}

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">Travel class</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {train.classes.map((cls) => {
            const availability = getAvailability(train, cls, quota, journeyDate, bookings)
            const checked = cls === travelClass
            return (
              <label
                key={cls}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-md border p-3',
                  checked ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-slate-200 hover:border-brand-300',
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="travel-class"
                    value={cls}
                    checked={checked}
                    onChange={() => onClassChange(cls)}
                    className="size-4 accent-brand-700"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      {cls} · {CLASS_LABELS[cls]}
                    </span>
                    <span className="text-sm text-slate-600">{formatINR(train.fares[cls] ?? 0)} per passenger</span>
                  </span>
                </span>
                <AvailabilityBadge availability={availability} />
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
