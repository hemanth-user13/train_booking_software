import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { PaymentMethod, PaymentsState } from './paymentTypes'

const initialState: PaymentsState = { items: [] }

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    paymentMethodAdded(state, action: PayloadAction<PaymentMethod>) {
      state.items.push(action.payload)
    },
    paymentMethodRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

const selectAllMethods = (state: RootState) => state.payments.items
const selectUserId = (state: RootState) => state.auth.currentUserId

export const selectMyPaymentMethods = createSelector([selectAllMethods, selectUserId], (items, userId) =>
  items.filter((item) => item.userId === userId),
)

export const { paymentMethodAdded, paymentMethodRemoved } = paymentsSlice.actions
export default paymentsSlice.reducer
