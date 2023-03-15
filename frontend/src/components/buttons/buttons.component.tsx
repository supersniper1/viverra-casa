import React, {FunctionComponent} from 'react';
import {useActions} from "../../hooks/redux.useActions";

export const Buttons: FunctionComponent = () => {

  const {
    TestChangeWidth,
    TestChangeHeight,
  } = useActions()

  return (
    <div>
      <button onClick={() => TestChangeWidth(200)}>width +</button>
      <button onClick={() => TestChangeHeight(200)}>height +</button>
    </div>
  );
};
