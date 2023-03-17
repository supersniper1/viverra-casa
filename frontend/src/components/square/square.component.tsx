import React, {FunctionComponent} from "react";
import {useTypedSelector} from "@hooks/redux.useTypedSelector";

export const Square: FunctionComponent = () => {

  const size = useTypedSelector((state) => state.Test)

  return (
    <div>
      <p>{size.width} width</p>
      <p>{size.height} height</p>
    </div>
  );
};
