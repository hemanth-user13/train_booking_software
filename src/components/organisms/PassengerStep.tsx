import { Trash, UserPlus } from 'lucide-react'
import { useState } from 'react'
import type { Passenger, PassengerDetails } from '../../features/passengers/passengerTypes'
import type { PassengerValues } from '../../validation/schemas'
import Button from '../atoms/Button'
import Card from '../atoms/Card'
import PassengerRow from '../molecules/PassengerRow'
import PassengerForm from './PassengerForm'

export interface DraftPassenger extends PassengerDetails {
  key: string
  /** Set when the passenger came from (or was saved to) the master list. */
  savedId?: string
}

interface PassengerStepProps {
  passengers: DraftPassenger[]
  savedPassengers: Passenger[]
  maxPassengers: number
  onToggleSaved: (passenger: Passenger) => void
  onAddNew: (values: PassengerValues, save: boolean) => void
  onRemove: (key: string) => void
}

export default function PassengerStep({
  passengers,
  savedPassengers,
  maxPassengers,
  onToggleSaved,
  onAddNew,
  onRemove,
}: PassengerStepProps) {
  const [showForm, setShowForm] = useState(passengers.length === 0 && savedPassengers.length === 0)
  const isFull = passengers.length >= maxPassengers

  return (
    <div className="space-y-6">
      <section aria-labelledby="selected-heading">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 id="selected-heading" className="text-sm font-semibold text-slate-900">
            Travelling passengers
          </h3>
          <span className="text-xs text-slate-500">
            {passengers.length} of {maxPassengers} max
          </span>
        </div>
        {passengers.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
            No passengers added yet.
          </p>
        ) : (
          <Card className="divide-y divide-slate-100 px-4">
            {passengers.map((passenger, index) => (
              <PassengerRow
                key={passenger.key}
                passenger={passenger}
                index={index}
                actions={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(passenger.key)}
                    aria-label={`Remove ${passenger.name}`}
                  >
                    <Trash aria-hidden="true" className="size-4" />
                  </Button>
                }
              />
            ))}
          </Card>
        )}
      </section>

      {savedPassengers.length > 0 && (
        <section aria-labelledby="saved-heading">
          <h3 id="saved-heading" className="mb-2 text-sm font-semibold text-slate-900">
            Pick from saved passengers
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {savedPassengers.map((saved) => {
              const checked = passengers.some((p) => p.savedId === saved.id)
              return (
                <label
                  key={saved.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 hover:border-brand-300 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!checked && isFull}
                    onChange={() => onToggleSaved(saved)}
                    className="size-4 accent-brand-700"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-slate-900">{saved.name}</span>
                    <span className="text-slate-500"> · {saved.age} yrs</span>
                  </span>
                </label>
              )
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="new-heading">
        {showForm ? (
          <Card className="p-4">
            <h3 id="new-heading" className="mb-3 text-sm font-semibold text-slate-900">
              Add a new passenger
            </h3>
            {isFull ? (
              <p className="text-sm text-slate-600">You have reached the passenger limit for this booking.</p>
            ) : (
              <PassengerForm
                showSaveOption
                submitLabel="Add to ticket"
                onSubmit={(values, { save }) => onAddNew(values, save)}
                onCancel={() => setShowForm(false)}
              />
            )}
          </Card>
        ) : (
          <Button variant="secondary" onClick={() => setShowForm(true)} disabled={isFull}>
            <UserPlus aria-hidden="true" className="size-4" /> Add new passenger
          </Button>
        )}
      </section>
    </div>
  )
}
