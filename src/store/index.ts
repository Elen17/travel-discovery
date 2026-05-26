import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import bookingReducer from './bookingSlice'
import searchReducer from './searchSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    search: searchReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
