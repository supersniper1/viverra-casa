import {createSlice} from "@reduxjs/toolkit";

export interface ILoginModalSlice {
  login: boolean;
}

const initialState: ILoginModalSlice = {
  login: false,
}

export const LoginModalSlice = createSlice({
  name: "LoginModal",
  initialState,
  reducers: {
    Login: (state) => {
      state.login = true
    },
    Logout: (state) => {
      state.login = false
    }
  }
})

export const LoginModalReducer = LoginModalSlice.reducer
export const LoginModalActions = LoginModalSlice.actions