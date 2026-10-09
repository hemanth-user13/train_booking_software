import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { seedTrains } from '../../data/seedTrains'

export const selectCustomTrains = (state: RootState) => state.trains.customTrains
export const selectLastSearch = (state: RootState) => state.trains.lastSearch

/** Seeded timetable plus admin-created trains. Seed data never goes through storage. */
export const selectAllTrains = createSelector([selectCustomTrains], (custom) => [...seedTrains, ...custom])

export const selectTrainById = (state: RootState, trainId: string | undefined) =>
  selectAllTrains(state).find((train) => train.id === trainId)
