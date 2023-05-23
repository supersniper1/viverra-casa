import { createSlice } from "@reduxjs/toolkit";

export interface IDesktops {
  active: string | undefined;
  all_desktops: IDesktop[];
}

export interface IDesktop {
  uuid: string;
  desktop_name: string;
}

const initialState: IDesktops = {
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
  },
});

export const DesktopReducer = DesktopSlice.reducer;
export const DesktopActions = DesktopSlice.actions;
