import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store/index.ts'
import { User } from '@/types'

interface InitialState {
  user: User | null
}

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  } as InitialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
    },
    unsetUser: (state) => {
      state.user = null
    },
  },
})

export const { setUser, unsetUser } = slice.actions

export const selectUser = (state: RootState): User | null => state.auth.user

export default slice.reducer
