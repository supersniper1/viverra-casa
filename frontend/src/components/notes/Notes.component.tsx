import React, { FunctionComponent, useMemo, useState } from "react";
import { IWidgetSlice } from "@store/slices/widgets/widgets.slice";
import { socket } from "@api/ws/socket";
import { useActions } from "@hooks/redux.useActions";
import s from "./notes.module.scss";
import { Icons } from "@assets/components/export";
import cn from "classnames";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { IFolder } from "@/store/slices/folders/folders.slice";
import { Rnd } from "react-rnd";

interface INotes {
  widget: IWidgetSlice;
}

export const Notes: FunctionComponent<INotes> = ({ widget }) => {
  const [notesWidget, setNotesWidget] = useState(widget);

  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const folders = useTypedSelector((state) => state.Folders.all_folders);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);
  const desktops = useTypedSelector((state) => state.Desktop.all_desktops);
  const maxZIndex = desktops.filter(
    (element) => element.uuid === activeDesktop
  )[0].max_z_index;

  const { WidgetsRefreshList, SetFolders, SetDesktops } = useActions();

  useMemo(() => {
    socket.emit("update_widget", notesWidget);
    socket.emit("get_all_desktops", null);
    socket.on("get_all_desktops_answer", (message: any) => {
      SetDesktops(message);
    });
  }, [notesWidget]);

  useMemo(() => {
    console.log("sad");
    socket.emit("get_all_widgets", null);
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message);
    });
  }, [notesWidget.is_collapsed]);

  const deleteWidget = () => {
    socket.emit("delete_widget", { widget_uuid: notesWidget.widget_uuid });
    socket.emit("get_all_widgets", null);
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message);
    });
  };

  const collapseWidget = () => {
    if (
      widgets.filter((element) => element.is_collapsed === true).length >= 1
    ) {
      // if collapsed notes more than 2
      console.log("if collapsed notes more than 2");
      if (
        folders.filter((element) => element.folder_name === "notes").length !==
        1
      ) {
        // if notes don't have folder
        console.log("if notes don't have folder");
        socket.emit("post_folder", {
          folder_name: "notes",
          desktop: activeDesktop,
        });
        socket.emit("get_all_folders", null);
        socket.on("get_all_folders_answer", (message: any) => {
          SetFolders(message);
          setNotesWidget((prev) => ({
            ...prev,
            is_collapsed: true,
            folder: message.filter(
              (element: IFolder) => element.folder_name === "notes"
            )[0].uuid,
          }));
        });
      } else {
        setNotesWidget((prev) => ({
          ...prev,
          is_collapsed: true,
          folder: folders.filter(
            (element) =>
              element.folder_name === "notes" &&
              element.desktop === activeDesktop
          )[0].uuid,
        }));
      }
    } else {
      setNotesWidget((prev) => ({
        ...prev,
        is_collapsed: true,
      }));
    }
  };

  const draggableOnStop = (e: any, data: any) => {
    setNotesWidget((prev) => ({
      ...prev,
      widget_x: data.lastX,
      widget_y: data.lastY,
    }));
  };

  const changeZIndex = () => {
    setNotesWidget((prev) => ({
      ...prev,
      z_index: maxZIndex + 1,
    }));
  };

  return (
    <div className={s.Resize} style={{ zIndex: notesWidget.z_index }}>
      <Rnd
        handle=".handle"
        defaultPosition={{ x: notesWidget.widget_x, y: notesWidget.widget_y }}
        onDragStop={(e, data) => draggableOnStop(e, data)}
        className={s.notesWidget}
        size={{
          width: notesWidget.widget_size_x,
          height: notesWidget.widget_size_y,
        }}
        onResizeStop={(e, direction, ref, d) =>
          setNotesWidget((prev) => ({
            ...prev,
            widget_size_x: prev.widget_size_x + d.width,
            widget_size_y: prev.widget_size_y + d.height,
          }))
        }
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
            value={notesWidget.text}
            onChange={(event) => {
              setNotesWidget((prev) => ({
                ...prev,
                text: event.target.value,
              }));
            }}
            className={s.Textarea}
          ></textarea>
        </div>
      </Rnd>
    </div>
  );
};
