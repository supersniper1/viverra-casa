import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { IWidgetSlice } from "@store/slices/widgets/widgets.slice";
import { socket } from "@api/ws/socket";
import { useActions } from "@hooks/redux.useActions";
import { Icons } from "@assets/components/export";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { Rnd } from "react-rnd";
import s from "./notes.module.scss";
import cn from "classnames";

interface INotes {
  widget: IWidgetSlice;
  setIsMoveable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Notes: FunctionComponent<INotes> = ({ widget, setIsMoveable }) => {
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);

  const {
    DeleteWidget,
    ChangeWidgetCollapsedByUUID,
    ChangeWidgetPositionByUUID,
    ChangeWidgetSizeByUUID,
    ChangeWidgetZIndexByUUID,
    ChangeWidgetTextByUUID,
  } = useActions();

  // useEffect(() => {
  //   socket.emit("update_widget", widget);
  // }, []);

  const deleteWidget = () => {
    socket.emit("delete_widget", { widget_uuid: widget.widget_uuid });
    DeleteWidget(widget);
  };

  const collapseWidget = () => {
    ChangeWidgetCollapsedByUUID(widget.widget_uuid);
  };

  const draggableOnStop = (e: any, data: any) => {
    ChangeWidgetPositionByUUID({
      widget_uuid: widget.widget_uuid,
      x: data.lastX,
      y: data.lastY,
    });
    setIsMoveable(false);
  };

  const changeZIndex = () => {
    ChangeWidgetZIndexByUUID({
      widget_uuid: widget.widget_uuid,
      z_index: activeDesktop.max_z_index + 1,
    });
  };

  return (
    <div className={s.Resize} style={{ zIndex: widget.z_index }}>
      <Rnd
        minWidth={150}
        minHeight={150}
        default={{
          x: widget.widget_x,
          y: widget.widget_y,
          width: widget.widget_size_x,
          height: widget.widget_size_y,
        }}
        onDragStop={(e, data) => draggableOnStop(e, data)}
        onDragStart={() => setIsMoveable(true)}
        className={s.notesWidget}
        size={{
          width: widget.widget_size_x,
          height: widget.widget_size_y,
        }}
        onResizeStop={(e, direction, ref, d) => {
          ChangeWidgetSizeByUUID({
            widget_uuid: widget.widget_uuid,
            widget_size_x: d.width,
            widget_size_y: d.height,
          });
        }}
      >
        <div onMouseDown={changeZIndex} className={s.Test}>
          <div className={s.TopPanel}>
            <div className={cn("handle", s.Handle)}></div>
            <div className={s.Buttons}>
              <button className={s.CloseButton} onClick={collapseWidget}>
                <Icons.CollapseWidget />
              </button>
              <button className={s.CloseButton} onClick={deleteWidget}>
                <Icons.CloseWidget />
              </button>
            </div>
          </div>
          <textarea
            value={widget.text}
            onChange={(event) => {
              ChangeWidgetTextByUUID({widget_uuid: widget.widget_uuid, text: event.target.value})
            }}
            className={s.Textarea}
          ></textarea>
        </div>
      </Rnd>
    </div>
  );
};
