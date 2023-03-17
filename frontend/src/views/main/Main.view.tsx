import React, {FunctionComponent} from 'react';
import {Square} from "../../components/square/square.component";
import {Buttons} from "../../components/buttons/buttons.component";
import {Icons} from "../../assets/components/export";

export const Main: FunctionComponent = () => {
  return (
    <div>
      MainPage
      <Icons.Login/>
      <Square/>
      <Buttons/>
    </div>
  );
};
