import {createSlice} from "@reduxjs/toolkit";

export interface IModalSlice {
  login: boolean;
  add_widget: boolean;
  widget_folder: boolean;
}

const initialState: IModalSlice = {
  login: false,
  add_widget: true,
  widget_folder: false,
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
    WidgetFolderOpen: (state) => {
      state.widget_folder = true
    },
    WidgetFolderClose: (state) => {
      state.widget_folder = false
    },
  }
})

export const ModalReducer = ModalSlice.reducer
export const ModalActions = ModalSlice.actions