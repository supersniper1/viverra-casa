import React, { FunctionComponent, useEffect } from "react";
import s from "./widget-folder-modal.module.scss";
import cs from "classnames";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { useActions } from "@/hooks/redux.useActions";
import { socket } from "@/api/ws/socket";
import { IWidgetSlice } from "@/store/slices/widgets/widgets.slice";

export const WidgetFolderModal: FunctionComponent = () => {
  const modalState = useTypedSelector((state) => state.Modal.widget_folder);
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);

  const { WidgetFolderClose, ChangeWidgetCollapsedByUUID } = useActions();

  const uncollapse = (widget: IWidgetSlice) => {
    const collapsedWidget = {
      ...widget,
      is_collapsed: false,
    };
    socket.emit("update_widget", collapsedWidget);
    ChangeWidgetCollapsedByUUID(widget.widget_uuid);
  };

  useEffect(() => {
    console.log(widgets);
  }, [widgets]);

  return (
    <div
      className={modalState ? s.Background : cs(s.Hidden, s.Background)}
      onClick={() => WidgetFolderClose()}
    >
      <div className={s.ModalWindow} onClick={(e) => e.stopPropagation()}>
        {widgets.map(
          (widget) =>
            widget.desktop === activeDesktop.uuid &&
            widget.is_collapsed === true &&
            widget.widget_tag === "note" && (
              <div
                onClick={() =>     ChangeWidgetCollapsedByUUID(widget.widget_uuid)                }
                className={s.NoteWidget}
                key={widget.widget_uuid}
              >
                {widget.text}
              </div>
            )
        )}
      </div>
    </div>
  );
};
