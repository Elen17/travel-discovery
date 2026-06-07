import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getCurrentUser } from '@/api/users'
import { clearAuthTokens, storeAuthTokens } from '@/configs/axios'
import type { AuthResponse, User } from '@/types/user'
import type { AppDispatch } from './index'

export type AuthState = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = {...action.payload.user, role: 'Admin'}
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      storeAuthTokens(action.payload.accessToken, action.payload.refreshToken)
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      clearAuthTokens()
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
})

export const { setCredentials, clearCredentials, setUser } = authSlice.actions

export const completeAuthSession = async (dispatch: AppDispatch, response: AuthResponse) => {
  dispatch(setCredentials(response))
  const user = await getCurrentUser()
  dispatch(setUser({...user, role: 'Admin'}))
}

export default authSlice.reducer
