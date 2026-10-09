import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { PaymentMethod } from '../../features/payments/paymentTypes'
import { cn } from '../../utils/cn'
import { formatINR } from '../../utils/format'
import Button from '../atoms/Button'
import Card from '../atoms/Card'
import Spinner from '../atoms/Spinner'
import Alert from '../molecules/Alert'
import PaymentMethodCard from '../molecules/PaymentMethodCard'
import PaymentMethodForm, { type PaymentMethodInput } from './PaymentMethodForm'

interface PaymentStepProps {
  amount: number
  methods: PaymentMethod[]
  selectedMethodId: string | null
  simulateFailure: boolean
  processing: boolean
  error: string | null
  onSelectMethod: (id: string) => void
  onAddMethod: (input: PaymentMethodInput) => void
  onSimulateFailureChange: (value: boolean) => void
  onPay: () => void
  onBack: () => void
}

export default function PaymentStep({
  amount,
  methods,
  selectedMethodId,
  simulateFailure,
  processing,
  error,
  onSelectMethod,
  onAddMethod,
  onSimulateFailureChange,
  onPay,
  onBack,
}: PaymentStepProps) {
  const [adding, setAdding] = useState(methods.length === 0)

  if (processing) {
    return (
      <div className="flex flex-col items-center py-12 text-center" role="status" aria-live="polite">
        <Spinner size="lg" className="text-brand-700" />
        <p className="mt-4 font-medium text-slate-900">Processing payment of {formatINR(amount)}</p>
        <p className="mt-1 text-sm text-slate-500">Please don&apos;t close or refresh this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {error && (
        <Alert tone="error" title="Payment failed">
          {error} You can retry, pick another method, or turn off the failure simulation.
        </Alert>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-900">Pay with</legend>
        {methods.length === 0 && !adding && (
          <p className="text-sm text-slate-600">You have no saved payment methods.</p>
        )}
        <div className="space-y-2">
          {methods.map((method) => (
            <label
              key={method.id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-md border p-3',
                selectedMethodId === method.id
                  ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                  : 'border-slate-200 hover:border-brand-300',
              )}
            >
              <input
                type="radio"
                name="payment-method"
                checked={selectedMethodId === method.id}
                onChange={() => onSelectMethod(method.id)}
                className="size-4 accent-brand-700"
              />
              <div className="flex-1">
                <PaymentMethodCard method={method} />
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {adding ? (
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">New payment method</h3>
          <PaymentMethodForm
            onSubmit={(input) => {
              onAddMethod(input)
              setAdding(false)
            }}
            onCancel={methods.length > 0 ? () => setAdding(false) : undefined}
          />
        </Card>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
          <Plus aria-hidden="true" className="size-4" /> Add payment method
        </Button>
      )}

      <label className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        <input
          type="checkbox"
          checked={simulateFailure}
          onChange={(e) => onSimulateFailureChange(e.target.checked)}
          className="mt-0.5 size-4 accent-amber-700"
        />
        <span>
          <span className="font-medium">Demo: simulate a failed payment</span>
          <span className="block text-xs">Use this to test the retry flow. No booking is created on failure.</span>
        </span>
      </label>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="success" size="lg" onClick={onPay} disabled={!selectedMethodId}>
          {error ? 'Retry payment' : `Pay ${formatINR(amount)}`}
        </Button>
      </div>
    </div>
  )
}
