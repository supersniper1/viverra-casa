import React, {FunctionComponent} from 'react';
import {Square} from "../../components/square/square.component";
import {Buttons} from "../../components/buttons/buttons.component";

export const Main: FunctionComponent = () => {
  return (
    <div>
      MainPage
      <Square/>
      <Buttons/>
    </div>
  );
};
