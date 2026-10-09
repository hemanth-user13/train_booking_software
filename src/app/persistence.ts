import { STORAGE_KEYS } from '../config/constants'
import { seedUsers } from '../data/seedUsers'
import type { User } from '../features/auth/authTypes'
import type { Booking } from '../features/bookings/bookingTypes'
import type { Passenger } from '../features/passengers/passengerTypes'
import type { PaymentMethod } from '../features/payments/paymentTypes'
import type { Train } from '../features/trains/trainTypes'
import { isArray, isStringOrNull, storageService } from '../services/storageService'
import type { RootState } from './store'

/** Builds the store's starting state from localStorage, falling back to seed data. */
export function loadPersistedState() {
  const storedUsers = storageService.read<User[]>(STORAGE_KEYS.users, [], isArray)
  // Make sure the demo accounts always exist without overwriting anything the user changed.
  const missingSeeds = seedUsers.filter((seed) => !storedUsers.some((user) => user.id === seed.id))
  const users = [...missingSeeds, ...storedUsers]

  const sessionUserId = storageService.read<string | null>(STORAGE_KEYS.session, null, isStringOrNull)
  const currentUserId = users.some((user) => user.id === sessionUserId) ? sessionUserId : null

  return {
    auth: { users, currentUserId },
    trains: {
      customTrains: storageService.read<Train[]>(STORAGE_KEYS.trains, [], isArray),
      lastSearch: null,
    },
    passengers: { items: storageService.read<Passenger[]>(STORAGE_KEYS.passengers, [], isArray) },
    payments: { items: storageService.read<PaymentMethod[]>(STORAGE_KEYS.paymentMethods, [], isArray) },
    bookings: { items: storageService.read<Booking[]>(STORAGE_KEYS.bookings, [], isArray) },
  }
}

/**
 * Writes only the slices whose reference changed since the last save.
 * Redux Toolkit keeps references stable for untouched data, so this is a cheap check.
 */
export function createPersister(initial: RootState) {
  let previous = initial

  return (state: RootState) => {
    if (state.auth.users !== previous.auth.users) storageService.write(STORAGE_KEYS.users, state.auth.users)
    if (state.auth.currentUserId !== previous.auth.currentUserId)
      storageService.write(STORAGE_KEYS.session, state.auth.currentUserId)
    if (state.trains.customTrains !== previous.trains.customTrains)
      storageService.write(STORAGE_KEYS.trains, state.trains.customTrains)
    if (state.passengers.items !== previous.passengers.items)
      storageService.write(STORAGE_KEYS.passengers, state.passengers.items)
    if (state.payments.items !== previous.payments.items)
      storageService.write(STORAGE_KEYS.paymentMethods, state.payments.items)
    if (state.bookings.items !== previous.bookings.items)
      storageService.write(STORAGE_KEYS.bookings, state.bookings.items)
    previous = state
  }
}
