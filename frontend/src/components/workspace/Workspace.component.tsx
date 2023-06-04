import React, { FunctionComponent, useRef, useState, useEffect } from "react";
import { useTypedSelector } from "@hooks/redux.useTypedSelector";
import { Component } from "@components/export.components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import s from "./workspace.module.scss";
import cn from "classnames";

export const Workspace: FunctionComponent = () => {
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);
  const desktopColor = useTypedSelector((state) => state.Desktop.color);
  const [isMoveable, setIsMoveable] = useState<boolean>(false);

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  console.log(widgets);

  useEffect(() => {
    console.log("rerendered")
  }, [])
  

  return (
    <div
      className={cn(
        s.workspace,
        desktopColor === "white" && s.ColorWhite,
        desktopColor === "light-pink" && s.ColorLightPink,
        desktopColor === "pink" && s.ColorPink
      )}
    >
      <TransformWrapper
        minScale={0.3}
        initialScale={1}
        limitToBounds={false}
        initialPositionX={1000}
        initialPositionY={1000}
        disabled={isMoveable}
        ref={transformComponentRef}
      >
        <React.Fragment>
          <TransformComponent
            contentClass={s.TransformComponent}
            wrapperStyle={{ height: "100vh", width: "100vw" }}
          >
            {widgets.map(
              (widget) =>
                widget.desktop === activeDesktop.uuid &&
                widget.is_collapsed === false &&
                widget.widget_tag === "note" && (
                  <Component.Notes key={widget.widget_uuid} widget={widget} setIsMoveable={setIsMoveable} />
                )
            )}
          </TransformComponent>
        </React.Fragment>
      </TransformWrapper>
    </div>
  );
};
