import { PAYMENT_DELAY_MS } from '../config/constants'
import type { PaymentMethod } from '../features/payments/paymentTypes'

export const PAYMENT_TYPE_LABELS: Record<PaymentMethod['type'], string> = {
  DEBIT_CARD: 'Debit card',
  CREDIT_CARD: 'Credit card',
  UPI: 'UPI',
}

export function paymentMethodLabel(method: PaymentMethod): string {
  if (method.type === 'UPI') return `UPI · ${method.upiId}`
  return `${PAYMENT_TYPE_LABELS[method.type]} •••• ${method.last4}`
}

export interface PaymentResult {
  success: boolean
  message: string
}

/**
 * Simulated payment. No gateway is called: it waits briefly and then succeeds,
 * unless the customer ticked the "simulate failure" option.
 */
export function processMockPayment(shouldFail: boolean): Promise<PaymentResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        shouldFail
          ? { success: false, message: 'The bank declined this payment (simulated). No money was taken.' }
          : { success: true, message: 'Payment successful' },
      )
    }, PAYMENT_DELAY_MS)
  })
}
