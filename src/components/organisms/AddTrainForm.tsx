import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ALL_CLASSES, CLASS_LABELS, WEEKDAY_SHORT } from '../../config/constants'
import { seedStations } from '../../data/seedStations'
import type { Train } from '../../features/trains/trainTypes'
import type { TravelClass } from '../../types/common'
import { cn } from '../../utils/cn'
import { arrivalDayOffset, formatDuration, timeToMinutes } from '../../utils/dateUtils'
import { trainSchema, type TrainFormValues } from '../../validation/schemas'
import Button from '../atoms/Button'
import Card from '../atoms/Card'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import FormField from '../molecules/FormField'

export type TrainInput = Omit<Train, 'id' | 'origin'>

interface AddTrainFormProps {
  initialTrain?: Train
  isNumberTaken: (number: string) => boolean
  onSubmit: (train: TrainInput) => void
  onCancel: () => void
}

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

function toFormValues(train?: Train): TrainFormValues {
  const classes = Object.fromEntries(
    ALL_CLASSES.map((cls) => [
      cls,
      {
        enabled: train?.classes.includes(cls) ?? false,
        fare: train?.fares[cls]?.toString() ?? '',
        seats: train?.seats[cls]?.toString() ?? '',
      },
    ]),
  ) as TrainFormValues['classes']

  return {
    number: train?.number ?? '',
    name: train?.name ?? '',
    from: train?.from ?? '',
    to: train?.to ?? '',
    departure: train?.departure ?? '',
    arrival: train?.arrival ?? '',
    arrivalDay: String(train ? arrivalDayOffset(train.departure, train.durationMinutes) : 0),
    runsOn: (train?.runsOn ?? [0, 1, 2, 3, 4, 5, 6]).map(String),
    classes,
  }
}

function journeyMinutes(values: Pick<TrainFormValues, 'departure' | 'arrival' | 'arrivalDay'>): number | null {
  if (!values.departure || !values.arrival) return null
  return timeToMinutes(values.arrival) + Number(values.arrivalDay) * 1440 - timeToMinutes(values.departure)
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  )
}

export default function AddTrainForm({ initialTrain, isNumberTaken, onSubmit, onCancel }: AddTrainFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TrainFormValues>({
    resolver: zodResolver(trainSchema),
    defaultValues: toFormValues(initialTrain),
  })

  const [departure, arrival, arrivalDay, classes] = useWatch({ control, name: ['departure', 'arrival', 'arrivalDay', 'classes'] })
  const duration = journeyMinutes({ departure, arrival, arrivalDay })

  const submit = (values: TrainFormValues) => {
    if (isNumberTaken(values.number)) {
      setError('number', { message: 'Another train already uses this number' })
      return
    }

    const enabled = ALL_CLASSES.filter((cls) => values.classes[cls].enabled)
    const fares: Partial<Record<TravelClass, number>> = {}
    const seats: Partial<Record<TravelClass, number>> = {}
    for (const cls of enabled) {
      fares[cls] = Number(values.classes[cls].fare)
      seats[cls] = Number(values.classes[cls].seats)
    }

    onSubmit({
      number: values.number,
      name: values.name,
      from: values.from,
      to: values.to,
      departure: values.departure,
      arrival: values.arrival,
      durationMinutes: journeyMinutes(values) ?? 0,
      runsOn: values.runsOn.map(Number).sort(),
      classes: enabled,
      fares,
      seats,
    })
  }

  const stationOptions = seedStations.map((station) => (
    <option key={station.code} value={station.code}>
      {station.name} ({station.code})
    </option>
  ))

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <Section title="Train details">
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <FormField label="Train number" htmlFor="train-number" error={errors.number?.message} required>
            <Input
              id="train-number"
              inputMode="numeric"
              maxLength={5}
              placeholder="12345"
              invalid={!!errors.number}
              aria-describedby="train-number-msg"
              {...register('number')}
            />
          </FormField>
          <FormField label="Train name" htmlFor="train-name" error={errors.name?.message} required>
            <Input
              id="train-name"
              placeholder="e.g. Coromandel Express"
              invalid={!!errors.name}
              aria-describedby="train-name-msg"
              {...register('name')}
            />
          </FormField>
        </div>
      </Section>

      <Section title="Route and timing" description="Times use the 24 hour clock at each station.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Source station" htmlFor="train-from" error={errors.from?.message} required>
            <Select id="train-from" invalid={!!errors.from} aria-describedby="train-from-msg" {...register('from')}>
              <option value="">Select station</option>
              {stationOptions}
            </Select>
          </FormField>
          <FormField label="Destination station" htmlFor="train-to" error={errors.to?.message} required>
            <Select id="train-to" invalid={!!errors.to} aria-describedby="train-to-msg" {...register('to')}>
              <option value="">Select station</option>
              {stationOptions}
            </Select>
          </FormField>
          <FormField label="Departure time" htmlFor="train-dep" error={errors.departure?.message} required>
            <Input
              id="train-dep"
              type="time"
              invalid={!!errors.departure}
              aria-describedby="train-dep-msg"
              {...register('departure')}
            />
          </FormField>
          <div className="grid grid-cols-[1fr_8rem] gap-3">
            <FormField label="Arrival time" htmlFor="train-arr" error={errors.arrival?.message} required>
              <Input
                id="train-arr"
                type="time"
                invalid={!!errors.arrival}
                aria-describedby="train-arr-msg"
                {...register('arrival')}
              />
            </FormField>
            <FormField label="Arrives" htmlFor="train-arr-day">
              <Select id="train-arr-day" {...register('arrivalDay')}>
                <option value="0">Same day</option>
                <option value="1">Next day</option>
                <option value="2">Day 3</option>
              </Select>
            </FormField>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Journey duration:{' '}
          <span className="font-medium text-slate-900">
            {duration !== null && duration > 0 ? formatDuration(duration) : '—'}
          </span>
        </p>
      </Section>

      <Section title="Operating days">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Operating days">
          {WEEK_ORDER.map((day) => (
            <label
              key={day}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-800"
            >
              <input type="checkbox" value={String(day)} className="size-4 accent-brand-700" {...register('runsOn')} />
              {WEEKDAY_SHORT[day]}
            </label>
          ))}
        </div>
        {errors.runsOn && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {errors.runsOn.message}
          </p>
        )}
      </Section>

      <Section title="Classes, fares and seats" description="Seats are released per class for every journey date.">
        {errors.classes?.message && (
          <p role="alert" className="mb-3 text-xs text-red-600">
            {errors.classes.message}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="pb-2 font-medium">Class</th>
                <th scope="col" className="pb-2 font-medium">Fare (₹)</th>
                <th scope="col" className="pb-2 font-medium">Seats per day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ALL_CLASSES.map((cls) => {
                const enabled = classes[cls].enabled
                const classErrors = errors.classes?.[cls]
                return (
                  <tr key={cls} className={cn(!enabled && 'text-slate-400')}>
                    <td className="py-2 pr-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="size-4 accent-brand-700" {...register(`classes.${cls}.enabled`)} />
                        <span className="font-medium">{cls}</span>
                        <span className="hidden text-xs sm:inline">{CLASS_LABELS[cls]}</span>
                      </label>
                    </td>
                    <td className="py-2 pr-3">
                      <Input
                        aria-label={`${cls} fare`}
                        inputMode="numeric"
                        disabled={!enabled}
                        invalid={!!classErrors?.fare}
                        className="h-9 w-28"
                        {...register(`classes.${cls}.fare`)}
                      />
                      {classErrors?.fare && <p className="mt-1 text-xs text-red-600">{classErrors.fare.message}</p>}
                    </td>
                    <td className="py-2">
                      <Input
                        aria-label={`${cls} seats`}
                        inputMode="numeric"
                        disabled={!enabled}
                        invalid={!!classErrors?.seats}
                        className="h-9 w-28"
                        {...register(`classes.${cls}.seats`)}
                      />
                      {classErrors?.seats && <p className="mt-1 text-xs text-red-600">{classErrors.seats.message}</p>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialTrain ? 'Save changes' : 'Add train'}
        </Button>
      </div>
    </form>
  )
}
