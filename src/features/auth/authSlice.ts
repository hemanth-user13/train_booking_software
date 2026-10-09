import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from './authTypes'

const initialState: AuthState = {
  users: [],
  currentUserId: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userRegistered(state, action: PayloadAction<User>) {
      state.users.push(action.payload)
    },
    loggedIn(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload
    },
    loggedOut(state) {
      state.currentUserId = null
    },
    profileUpdated(state, action: PayloadAction<{ id: string; name: string; phone: string }>) {
      const user = state.users.find((item) => item.id === action.payload.id)
      if (user) {
        user.name = action.payload.name
        user.phone = action.payload.phone
      }
    },
  },
})

export const { userRegistered, loggedIn, loggedOut, profileUpdated } = authSlice.actions
export default authSlice.reducer
