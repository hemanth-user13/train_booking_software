import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SearchQuery, Train, TrainsState } from './trainTypes'

const initialState: TrainsState = {
  customTrains: [],
  lastSearch: null,
}

const trainsSlice = createSlice({
  name: 'trains',
  initialState,
  reducers: {
    trainAdded(state, action: PayloadAction<Train>) {
      state.customTrains.push(action.payload)
    },
    trainUpdated(state, action: PayloadAction<Train>) {
      const index = state.customTrains.findIndex((train) => train.id === action.payload.id)
      if (index !== -1) state.customTrains[index] = action.payload
    },
    trainDeleted(state, action: PayloadAction<string>) {
      state.customTrains = state.customTrains.filter((train) => train.id !== action.payload)
    },
    searchSaved(state, action: PayloadAction<SearchQuery>) {
      state.lastSearch = action.payload
    },
  },
})

export const { trainAdded, trainUpdated, trainDeleted, searchSaved } = trainsSlice.actions
export default trainsSlice.reducer
