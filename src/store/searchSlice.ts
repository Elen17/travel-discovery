import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { HotelSearchParams } from '@/types/hotel'

export type SearchState = {
  params: HotelSearchParams
}

const initialState: SearchState = {
  params: {
    page: 0,
    size: 9,
  },
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<HotelSearchParams>) => {
      state.params = { ...state.params, ...action.payload }
    },
    resetSearchParams: (state) => {
      state.params = initialState.params
    },
  },
})

export const { setSearchParams, resetSearchParams } = searchSlice.actions
export default searchSlice.reducer
