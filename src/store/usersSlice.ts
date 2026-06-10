import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/user'

export type UsersState = {
  list: User[]
}

const initialState: UsersState = {
  list: [],
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserList: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload)
    },
    replaceUser: (state, action: PayloadAction<User>) => {
      const index = state.list.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((user) => user.id !== action.payload)
    },
  },
})

export const { setUserList, addUser, replaceUser, removeUser } = usersSlice.actions
export default usersSlice.reducer
