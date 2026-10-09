import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Passenger, PassengersState } from './passengerTypes'

const initialState: PassengersState = { items: [] }

const passengersSlice = createSlice({
  name: 'passengers',
  initialState,
  reducers: {
    passengerAdded(state, action: PayloadAction<Passenger>) {
      state.items.push(action.payload)
    },
    passengerUpdated(state, action: PayloadAction<Passenger>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) state.items[index] = action.payload
    },
    passengerDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

const selectAllPassengers = (state: RootState) => state.passengers.items
const selectUserId = (state: RootState) => state.auth.currentUserId

export const selectMyPassengers = createSelector([selectAllPassengers, selectUserId], (items, userId) =>
  items.filter((item) => item.userId === userId),
)

export const { passengerAdded, passengerUpdated, passengerDeleted } = passengersSlice.actions
export default passengersSlice.reducer
