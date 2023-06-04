import { configureStore } from "@reduxjs/toolkit";
import { TestReducer } from "./slices/test/test.slice";
import { WidgetsReducer } from "@store/slices/widgets/widgets.slice";
import { ModalReducer } from "@store/slices/modal/modal.slice";
import { DesktopReducer } from "./slices/desktop/desktop.slice";

export const store = configureStore({
  reducer: {
    Test: TestReducer,
    Widgets: WidgetsReducer,
    Modal: ModalReducer,
    Desktop: DesktopReducer,
  },
});

export type TypedRootState = ReturnType<typeof store.getState>;
