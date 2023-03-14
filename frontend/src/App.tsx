import React, {FunctionComponent} from "react";
import {Square} from "./components/square/square.component";
import {Buttons} from "./components/buttons/buttons.component";

export const AppCore: FunctionComponent = () => {
  return (
    <div className="app">
      <Square/>
      <Buttons/>
      work
    </div>
  )
}
