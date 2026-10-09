import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import bookingsReducer from '../features/bookings/bookingsSlice'
import passengersReducer from '../features/passengers/passengersSlice'
import paymentsReducer from '../features/payments/paymentsSlice'
import trainsReducer from '../features/trains/trainsSlice'
import { createPersister, loadPersistedState } from './persistence'

const rootReducer = combineReducers({
  auth: authReducer,
  trains: trainsReducer,
  passengers: passengersReducer,
  payments: paymentsReducer,
  bookings: bookingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadPersistedState(),
})

const persist = createPersister(store.getState())
store.subscribe(() => persist(store.getState()))

export type AppDispatch = typeof store.dispatch
