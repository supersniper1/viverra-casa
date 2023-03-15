import { configureStore } from "@reduxjs/toolkit";
import {TestReducer} from "./slices/test/test.slice";

export const store = configureStore({
  reducer: {
    Test: TestReducer
  }
})

export type TypedRootState = ReturnType<typeof store.getState>;
