import React, { FunctionComponent } from "react";
import { useTypedSelector } from "@hooks/redux.useTypedSelector";
import { Component } from "@components/export.components";
import s from "./workspace.module.scss";
import { Icons } from "@/assets/components/export";
import { useActions } from "@hooks/redux.useActions";
import { socket } from "@api/ws/socket";
import { IWidgetSlice } from "@store/slices/widgets/widgets.slice";
import cn from "classnames";

export const Workspace: FunctionComponent = () => {
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);
  const desktopColor = useTypedSelector((state) => state.Desktop.color);
  const folders = useTypedSelector((state) => state.Folders.all_folders);

  console.log(widgets);

  const { WidgetsRefreshList, AddWidgetOpen } = useActions();

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

  return (
    <div
      className={cn(
        s.workspace,
        desktopColor === "white" && s.ColorWhite,
        desktopColor === "light-pink" && s.ColorLightPink,
        desktopColor === "pink" && s.ColorPink
      )}
    >
      <Component.AddWidgetModal />
      {widgets.map(
        (widget) =>
          widget.desktop === activeDesktop &&
          widget.is_collapsed === false &&
          widget.widget_tag === "note" && (
            <Component.Notes key={widget.widget_uuid} widget={widget} />
          )
      )}
      <div className={s.bottomPanel}>
        {folders.map((folder) => folder.folder_name === "note" && (
          <button key={folder.uuid}>
            <Icons.NotesWidget className={s.NotesCollapsedIcon} />
          </button>
        ))}
        {widgets.map(
          (widget) =>
            widget.desktop === activeDesktop &&
            widget.is_collapsed === true &&
            widget.widget_tag === "note" &&
            widget.folder === null && (
              <button
                key={widget.widget_uuid}
                onClick={() => uncollapse(widget)}
              >
                <Icons.NotesWidget className={s.NotesCollapsedIcon} />
              </button>
            )
        )}
        <button onClick={() => AddWidgetOpen()} className={s.button}>
          <Icons.AddWidget className={s.addWidgetIcon} />
        </button>
      </div>
    </div>
  );
};
