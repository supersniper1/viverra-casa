import React, { FunctionComponent, useRef, ReactNode } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import s from "./react-zoom.module.scss";

interface IFunctionComponent {
  children: ReactNode;
}

export const ReactZoom: FunctionComponent<IFunctionComponent> = ({
  children,
}) => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  return (
    <TransformWrapper
      minScale={.3}
      initialScale={1}      
      limitToBounds={false}
      initialPositionX={1000}
      initialPositionY={1000}
      ref={transformComponentRef}
    >
      <React.Fragment>
        <TransformComponent
          contentClass={s.Main}
          wrapperStyle={{ height: "100vh", width: "100vw" }}
        >
          {children}
        </TransformComponent>
      </React.Fragment>
    </TransformWrapper>
  );
};
