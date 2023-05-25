import { createSlice } from "@reduxjs/toolkit";

export interface IDesktops {
  color: "white" | "light-pink" | "pink";
  active: string | undefined;
  all_desktops: IDesktop[];
}

export interface IDesktop {
  uuid: string;
  desktop_name: string;
}

const initialState: IDesktops = {
  color: "white",
  active: undefined,
  all_desktops: [],
};

export const DesktopSlice = createSlice({
  name: "Desktop",
  initialState,
  reducers: {
    SetDesktops: (state, action) => {
      state.all_desktops = action.payload;
    },
    SetActive: (state, action) => {
      state.active = action.payload;
    },
    SetColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

export const DesktopReducer = DesktopSlice.reducer;
export const DesktopActions = DesktopSlice.actions;
