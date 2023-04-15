import { configureStore } from "@reduxjs/toolkit";
import {TestReducer} from "./slices/test/test.slice";
import {WidgetsReducer} from "@store/slices/widgets/widgets.slice";

export const store = configureStore({
  reducer: {
    Test: TestReducer,
    Widgets: WidgetsReducer,
  }
})

export type TypedRootState = ReturnType<typeof store.getState>;
