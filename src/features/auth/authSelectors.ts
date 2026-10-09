import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { toPublicUser } from '../../services/authService'

export const selectUsers = (state: RootState) => state.auth.users
const selectCurrentUserId = (state: RootState) => state.auth.currentUserId

export const selectCurrentUser = createSelector([selectUsers, selectCurrentUserId], (users, id) => {
  const user = users.find((item) => item.id === id)
  return user ? toPublicUser(user) : null
})
