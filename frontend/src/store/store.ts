import { configureStore } from "@reduxjs/toolkit";
import {TestReducer} from "./slices/test/test.slice";
import {WidgetsReducer} from "@store/slices/widgets/widgets.slice";
import {LoginModalReducer} from "@store/slices/login-modal/loginModal";

export const store = configureStore({
  reducer: {
    Test: TestReducer,
    Widgets: WidgetsReducer,
    LoginModal: LoginModalReducer,
  }
})

export type TypedRootState = ReturnType<typeof store.getState>;
