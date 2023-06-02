import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import React, { FunctionComponent } from "react";
import { Icons } from "@/assets/components/export";
import s from "./bottom-dock.module.scss";
import { useActions } from "@/hooks/redux.useActions";
import { IWidgetSlice } from "@/store/slices/widgets/widgets.slice";
import { socket } from "@/api/ws/socket";

export const BottomDock: FunctionComponent = () => {
  const folders = useTypedSelector((state) => state.Folders.all_folders);
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);

  const { WidgetFolderOpen, WidgetsRefreshList, AddWidgetOpen } = useActions();

  const uncollapse = (widget: IWidgetSlice) => {
    const collapsedWidget = {
      ...widget,
      is_collapsed: false,
    };
    socket.emit("update_widget", collapsedWidget);
    socket.emit("get_all_widgets", null);
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message);
    });
  };

  const openFolder = () => {
    WidgetFolderOpen();
  };

  return (
    <div className={s.bottomPanel}>
      {folders.map(
        (folder) =>
          folder.folder_name === "notes" &&
          folder.desktop === activeDesktop.uuid && (
            <button key={folder.uuid} onClick={openFolder}>
              <Icons.NotesWidget className={s.NotesCollapsedIcon} />
            </button>
          )
      )}
      {widgets.map(
        (widget) =>
          widget.desktop === activeDesktop.uuid &&
          widget.is_collapsed === true &&
          widget.widget_tag === "note" &&
          widget.folder === null && (
            <button key={widget.widget_uuid} onClick={() => uncollapse(widget)}>
              <Icons.NotesWidget className={s.NotesCollapsedIcon} />
            </button>
          )
      )}
      <button onClick={() => AddWidgetOpen()} className={s.button}>
        <Icons.AddWidget className={s.addWidgetIcon} />
      </button>
    </div>
  );
};
