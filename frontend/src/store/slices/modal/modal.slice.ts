import {createSlice} from "@reduxjs/toolkit";

export interface IModalSlice {
  login: boolean;
  add_widget: boolean;
}

const initialState: IModalSlice = {
  login: false,
  add_widget: false,
}

export const ModalSlice = createSlice({
  name: "Modal",
  initialState,
  reducers: {
    Login: (state) => {
      state.login = true
    },
    Logout: (state) => {
      state.login = false
    },
    AddWidgetOpen: (state) => {
      state.add_widget = true
    },
    AddWidgetClose: (state) => {
      state.add_widget = false
    },
  }
})

export const ModalReducer = ModalSlice.reducer
export const ModalActions = ModalSlice.actions