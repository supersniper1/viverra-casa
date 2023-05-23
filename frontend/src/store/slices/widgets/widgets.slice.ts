import { createSlice } from "@reduxjs/toolkit";

export interface IWidgetSlice {
  widget_tag: string;
  widget_uuid: string;
  widget_size_x: number;
  widget_size_y: number;
  widget_x: number;
  widget_y: number;
  z_index: number;
  is_collapsed: boolean;
  desktop: string;
  folder: string | null;
  tracked_server?: string;
  text?: string;
  tracked_name?: string;
}

export interface IWidgetsSlice {
  all_widgets: IWidgetSlice[];
}

const initialState: IWidgetsSlice = {
  all_widgets: [],
};

export const WidgetsSlice = createSlice({
  name: "Widgets",
  initialState,
  reducers: {
    WidgetsRefreshList: (state, action) => {
      state.all_widgets = action.payload;
    },
    UpdateWidget: (state, action) => {
      console.log(state, action);
    },
  },
});

export const WidgetsReducer = WidgetsSlice.reducer;
export const WidgetsActions = WidgetsSlice.actions;
