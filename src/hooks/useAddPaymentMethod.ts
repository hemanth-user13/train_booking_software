import { useAppDispatch, useAppSelector } from '../app/hooks'
import type { PaymentMethodInput } from '../components/organisms/PaymentMethodForm'
import { selectCurrentUser } from '../features/auth/authSelectors'
import { paymentMethodAdded } from '../features/payments/paymentsSlice'
import type { PaymentMethod } from '../features/payments/paymentTypes'
import { createId } from '../utils/format'
import { useToast } from './useToast'

/** Shared by the payment methods page and the booking checkout. Returns the new method. */
export function useAddPaymentMethod() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const { showToast } = useToast()

  return (input: PaymentMethodInput): PaymentMethod | null => {
    if (!user) return null
    const method: PaymentMethod = {
      id: createId('pm'),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...input,
    }
    dispatch(paymentMethodAdded(method))
    showToast('Payment method saved.')
    return method
  }
}
