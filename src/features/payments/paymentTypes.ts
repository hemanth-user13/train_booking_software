export type PaymentMethodType = 'DEBIT_CARD' | 'CREDIT_CARD' | 'UPI'

/**
 * A reference to a simulated payment method. Only display-safe values are kept:
 * the last four digits of a card, never the full number or CVV.
 */
export interface PaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  holderName?: string
  last4?: string
  /** "MM/YY" */
  expiry?: string
  upiId?: string
  createdAt: string
}

export interface PaymentsState {
  items: PaymentMethod[]
}
