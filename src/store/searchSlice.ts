import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Hotel, HotelCatalogParams, HotelLiveSearchParams } from '@/types/hotel'

const DEFAULT_PAGE_SIZE = 10
export type SearchState = {
  catalogParams: Partial<HotelCatalogParams>
  liveSearchParams: Partial<HotelLiveSearchParams>
  liveSearchResults: Hotel[]
}

const initialState: SearchState = {
  catalogParams: {
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  },
  liveSearchParams: {
    adults: 1,
  },
  liveSearchResults: [],
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setCatalogParams: (state, action: PayloadAction<Partial<HotelCatalogParams>>) => {
      state.catalogParams = { ...state.catalogParams, ...action.payload }
    },
    setLiveSearchParams: (state, action: PayloadAction<Partial<HotelLiveSearchParams>>) => {
      state.liveSearchParams = { ...state.liveSearchParams, ...action.payload }
    },
    setLiveSearchResults: (state, action: PayloadAction<Hotel[]>) => {
      state.liveSearchResults = action.payload
    },
    resetSearchParams: (state) => {
      state.catalogParams = initialState.catalogParams
      state.liveSearchParams = initialState.liveSearchParams
      state.liveSearchResults = initialState.liveSearchResults
    },
  },
})

export const {
  setCatalogParams,
  setLiveSearchParams,
  setLiveSearchResults,
  resetSearchParams,
} = searchSlice.actions
export default searchSlice.reducer
