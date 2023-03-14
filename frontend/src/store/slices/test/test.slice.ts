import { createSlice } from "@reduxjs/toolkit";

export interface ITestSlice {
  height: number;
  width: number;
}

const initialState: ITestSlice = {
  height: 0,
  width: 0
};

export const TestSlice = createSlice({
  name: "Test",
  initialState,
  reducers: {
    TestChangeWidth: (state, action) => {
      state.width = action.payload;
    },
    TestChangeHeight: (state, action) => {
      state.height = action.payload;
    },
  },
});

export const TestReducer = TestSlice.reducer;
export const TestActions = TestSlice.actions;
