import React, { FunctionComponent, useRef, ReactNode } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

interface IControls {
  zoomIn: any;
  zoomOut: any;
  resetTransform: any;
}

const Controls: FunctionComponent<IControls> = ({
  zoomIn,
  zoomOut,
  resetTransform,
}) => (
  <>
    <button onClick={() => zoomIn()}>+</button>
    <button onClick={() => zoomOut()}>-</button>
    <button onClick={() => resetTransform()}>x</button>
  </>
);

interface IFunctionComponent {
    children: ReactNode;
}

export const ReactZoom: FunctionComponent<IFunctionComponent> = ({children}) => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  return (
    <TransformWrapper
      minScale={0.1}
      initialScale={1}
      initialPositionX={1000}
      initialPositionY={1000}
      ref={transformComponentRef}
    >
      {(utils) => (
        <React.Fragment>
          <Controls {...utils} />
          <TransformComponent>
            <div style={{ width: "100vw", height: "100vh" }}>
              {children}
            </div>
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};
