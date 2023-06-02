import { createSlice } from "@reduxjs/toolkit";

export interface IDesktops {
  color: "white" | "light-pink" | "pink";
  active: IDesktop;
  all_desktops: IDesktop[];
  remove_queue: IDesktop[];
}

export interface IDesktop {
  uuid: string;
  desktop_name: string;
  max_z_index: number;
}

const initialState: IDesktops = {
  color: "white",
  active: {
    uuid: "",
    desktop_name: "",
    max_z_index: 0,
  },
  all_desktops: [],
  remove_queue: [],
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
    SetZIndex: (state) => {
      state.active.max_z_index++;
    },
    SetQueue: (state, action) => {
      state.remove_queue = [...state.remove_queue, action.payload];
    },
    UndoDeleteDesktop: (state, action) => {
      state.remove_queue = state.remove_queue.filter(
        (element) => element !== action.payload
      );
    },
    DeleteDesktop: (state, action) => {
      state.remove_queue = action.payload
    },
  },
});

export const DesktopReducer = DesktopSlice.reducer;
export const DesktopActions = DesktopSlice.actions;
