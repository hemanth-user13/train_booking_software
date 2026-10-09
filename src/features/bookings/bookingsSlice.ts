import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Booking, BookingsState } from './bookingTypes'

const initialState: BookingsState = { items: [] }

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    bookingCreated(state, action: PayloadAction<Booking>) {
      // The booking id is created once per checkout, so a repeated dispatch is ignored.
      if (state.items.some((item) => item.id === action.payload.id)) return
      state.items.push(action.payload)
    },
    bookingCancelled(state, action: PayloadAction<{ id: string; refundAmount: number }>) {
      const booking = state.items.find((item) => item.id === action.payload.id)
      if (!booking || booking.status === 'CANCELLED') return
      booking.status = 'CANCELLED'
      booking.refundAmount = action.payload.refundAmount
      booking.cancelledAt = new Date().toISOString()
    },
  },
})

export const { bookingCreated, bookingCancelled } = bookingsSlice.actions
export default bookingsSlice.reducer
