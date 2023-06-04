import { socket } from "@/api/ws/socket";
import { createSlice } from "@reduxjs/toolkit";

export interface IWidgetSlice {
  resourcetype: "WidgetsNoteModel";
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
    DeleteWidget: (state, action) => {
      state.all_widgets = state.all_widgets.filter((element) => element.widget_uuid !== action.payload.widget_uuid)
      console.log(action.payload.widget_uuid)
    },
    ChangeWidgetPositionByUUID: (state, action) => {
      const widget = state.all_widgets.find(({ widget_uuid }) => widget_uuid === action.payload.widget_uuid);
      widget.widget_x = action.payload.x;
      widget.widget_y = action.payload.y;
      console.log(widget)
      socket.emit("update_widget", widget);
    },
    ChangeWidgetCollapsedByUUID: (state, action) => {
      const widget = state.all_widgets.find(({ widget_uuid }) => widget_uuid === action.payload);
      widget.is_collapsed = !widget.is_collapsed;
      socket.emit("update_widget", widget);
    },
    ChangeWidgetZIndexByUUID: (state, action) => {
      const widget = state.all_widgets.find(({ widget_uuid }) => widget_uuid === action.payload.widget_uuid);
      widget.z_index = action.payload.z_index;
      socket.emit("update_widget", widget);
    },
    ChangeWidgetSizeByUUID: (state, action) => {
      const widget = state.all_widgets.find(({ widget_uuid }) => widget_uuid === action.payload.widget_uuid);
      widget.widget_size_x = widget.widget_size_x + action.payload.widget_size_x;
      widget.widget_size_y = widget.widget_size_y + action.payload.widget_size_y;
      socket.emit("update_widget", widget);
    },
    ChangeWidgetTextByUUID: (state, action) => {
      const widget = state.all_widgets.find(({ widget_uuid }) => widget_uuid === action.payload.widget_uuid);
      widget.text = action.payload.text;
      socket.emit("update_widget", widget);
    },
  },
});

export const WidgetsReducer = WidgetsSlice.reducer;
export const WidgetsActions = WidgetsSlice.actions;
