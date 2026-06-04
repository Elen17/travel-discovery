import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { HotelCatalogParams, HotelLiveSearchParams } from '@/types/hotel'

const DEFAULT_PAGE_SIZE = 10;
export type SearchState = {
  catalogParams: Partial<HotelCatalogParams>
  liveSearchParams: Partial<HotelLiveSearchParams>
}

const initialState: SearchState = {
  catalogParams: {
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  },
  liveSearchParams: {
    adults: 1,
  },
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
    resetSearchParams: (state) => {
      state.catalogParams = initialState.catalogParams
      state.liveSearchParams = initialState.liveSearchParams
    },
  },
})

export const { setCatalogParams, setLiveSearchParams, resetSearchParams } = searchSlice.actions
export default searchSlice.reducer
