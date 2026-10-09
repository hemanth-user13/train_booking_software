import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

export const selectAllBookings = (state: RootState) => state.bookings.items
const selectUserId = (state: RootState) => state.auth.currentUserId

/** Current user's bookings, newest first. */
export const selectMyBookings = createSelector([selectAllBookings, selectUserId], (items, userId) =>
  items
    .filter((booking) => booking.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
)

export const selectBookingById = (state: RootState, bookingId: string | undefined) =>
  state.bookings.items.find((booking) => booking.id === bookingId)
