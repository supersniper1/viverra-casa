import React, { FunctionComponent } from "react";
import { useTypedSelector } from "@hooks/redux.useTypedSelector";
import { Component } from "@components/export.components";
import s from "./workspace.module.scss";
import cn from "classnames";

export const Workspace: FunctionComponent = () => {
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);
  const desktopColor = useTypedSelector((state) => state.Desktop.color);

  console.log(widgets);

  return (
    <div
      className={cn(
        s.workspace,
        desktopColor === "white" && s.ColorWhite,
        desktopColor === "light-pink" && s.ColorLightPink,
        desktopColor === "pink" && s.ColorPink
      )}
    >
   {/* <Component.ReactZoom> */}
      {/* <TransformWrapper> */}
        {/* <TransformComponent> */}
          {widgets.map(
            (widget) =>
              widget.desktop === activeDesktop.uuid &&
              widget.is_collapsed === false &&
              widget.widget_tag === "note" && (
                <Component.Notes key={widget.widget_uuid} widget={widget} />
              )
          )}
        {/* </TransformComponent> */}
      {/* </TransformWrapper> */}
    {/* </Component.ReactZoom> */}
    </div>
  );
};
