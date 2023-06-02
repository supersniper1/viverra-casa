import React, { FunctionComponent } from "react";
import s from "./widget-folder-modal.module.scss";
import cs from "classnames";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { useActions } from "@/hooks/redux.useActions";
import { socket } from "@/api/ws/socket";
import { IWidgetSlice } from "@/store/slices/widgets/widgets.slice";
import { IFolders } from "@/store/slices/folders/folders.slice";

export const WidgetFolderModal: FunctionComponent = () => {
  const modalState = useTypedSelector((state) => state.Modal.widget_folder);
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);
  const folders = useTypedSelector((state) => state.Folders.all_folders);

  const { WidgetFolderClose, WidgetsRefreshList, SetFolders, UpdateWidget } = useActions();

  const uncollapse = (widget: IWidgetSlice) => {
    const collapsedWidget = {
      ...widget,
      is_collapsed: false,
    };
    socket.emit("update_widget", collapsedWidget);
    UpdateWidget({prev: widget, new: collapsedWidget})
    if (
      widgets.filter(
        (element) =>
          element.desktop === activeDesktop.uuid &&
          element.is_collapsed === true &&
          element.widget_tag === "note"
      ).length <= 1
    ) {
      socket.emit("delete_folder", {
        uuid: folders.filter((element) => element.folder_name === "notes")[0]
          .uuid,
      });
      socket.emit("get_all_folders", null);
      socket.on("get_all_folders_answer", (message: IFolders) => {
        SetFolders(message);
      });
      socket.emit("get_all_widgets", null);
      socket.on("get_all_widgets_answer", (message: any) => {
        WidgetsRefreshList(message);
        console.log(message);
      });
      setTimeout(() => {
        console.log(widgets);
      }, 5000)
    }
  };

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
                onClick={() => uncollapse(widget)}
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
