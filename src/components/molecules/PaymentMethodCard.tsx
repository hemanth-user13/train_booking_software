import { CreditCard, Smartphone } from 'lucide-react'
import type { ReactNode } from 'react'
import type { PaymentMethod } from '../../features/payments/paymentTypes'
import { PAYMENT_TYPE_LABELS } from '../../services/paymentService'

interface PaymentMethodCardProps {
  method: PaymentMethod
  actions?: ReactNode
}

export default function PaymentMethodCard({ method, actions }: PaymentMethodCardProps) {
  const Icon = method.type === 'UPI' ? Smartphone : CreditCard

  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">{PAYMENT_TYPE_LABELS[method.type]}</p>
        {method.type === 'UPI' ? (
          <p className="truncate text-sm text-slate-600">{method.upiId}</p>
        ) : (
          <p className="text-sm text-slate-600">
            <span className="font-mono tracking-wider">•••• {method.last4}</span>
            <span className="ml-2 text-xs text-slate-500">
              {method.holderName} · Exp {method.expiry}
            </span>
          </p>
        )}
      </div>
      {actions}
    </div>
  )
}
