import React, {FunctionComponent} from "react";
import { Square } from "./components/square/square.component";
import { Buttons } from "./components/buttons/buttons.component";
import { Provider } from "react-redux";
import { store } from './store/store'

export const AppCore: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <Square/>
        <Buttons/>
      </div>
    </Provider>
  )
}
