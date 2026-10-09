import type { ReactNode } from 'react'
import { BERTH_LABELS, GENDER_LABELS } from '../../config/constants'
import type { PassengerDetails } from '../../features/passengers/passengerTypes'

interface PassengerRowProps {
  passenger: PassengerDetails
  index?: number
  actions?: ReactNode
}

export default function PassengerRow({ passenger, index, actions }: PassengerRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      {index !== undefined && (
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
          {index + 1}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{passenger.name}</p>
        <p className="text-xs text-slate-500">
          {passenger.age} yrs · {GENDER_LABELS[passenger.gender]} · {BERTH_LABELS[passenger.berth]}
        </p>
      </div>
      {actions && <div className="flex shrink-0 gap-1">{actions}</div>}
    </div>
  )
}
