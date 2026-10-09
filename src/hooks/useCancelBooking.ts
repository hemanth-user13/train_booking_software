import { useAppDispatch } from '../app/hooks'
import { bookingCancelled } from '../features/bookings/bookingsSlice'
import type { Booking } from '../features/bookings/bookingTypes'
import { canCancel } from '../services/bookingService'
import { calculateRefund } from '../utils/fareCalculator'
import { formatINR } from '../utils/format'
import { useConfirmation } from './useConfirmation'
import { useToast } from './useToast'

/** Cancel flow shared by the bookings list and the ticket page. Render `dialog` once. */
export function useCancelBooking() {
  const dispatch = useAppDispatch()
  const { showToast } = useToast()
  const { confirm, dialog } = useConfirmation()

  const cancelBooking = async (booking: Booking) => {
    if (!canCancel(booking)) return
    const refund = calculateRefund(booking)

    const accepted = await confirm({
      title: 'Cancel this ticket?',
      description: `PNR ${booking.pnr} for ${booking.passengers.length} passenger(s) will be cancelled. Estimated refund: ${formatINR(refund)} of ${formatINR(booking.fare.total)}.`,
      confirmText: 'Cancel ticket',
      cancelText: 'Keep ticket',
      variant: 'danger',
    })
    if (!accepted) return

    dispatch(bookingCancelled({ id: booking.id, refundAmount: refund }))
    showToast(`Ticket cancelled. ${formatINR(refund)} will be refunded to your original payment method.`)
  }

  return { cancelBooking, dialog }
}
