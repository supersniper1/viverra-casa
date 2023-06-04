import React, { FunctionComponent, useMemo, useState } from "react";
import { IWidgetSlice } from "@store/slices/widgets/widgets.slice";
import { socket } from "@api/ws/socket";
import { useActions } from "@hooks/redux.useActions";
import { Icons } from "@assets/components/export";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { IFolder } from "@/store/slices/folders/folders.slice";
import { Rnd } from "react-rnd";
import s from "./notes.module.scss";
import cn from "classnames";

interface INotes {
  widget: IWidgetSlice;
  setIsMoveable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Notes: FunctionComponent<INotes> = ({ widget, setIsMoveable }) => {
  const [notesWidget, setNotesWidget] = useState(widget);

  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const folders = useTypedSelector((state) => state.Folders.all_folders);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);

  const { SetFolders, UpdateWidget, DeleteWidget, SetZIndex } = useActions();

  const updateWidget = () => {
    socket.emit("update_widget", notesWidget);
    SetZIndex()
    UpdateWidget({prev: widget, new: notesWidget})
  }

  const deleteWidget = () => {
    socket.emit("delete_widget", { widget_uuid: notesWidget.widget_uuid });
    widgets.map((element) => console.log(element.widget_uuid))
    DeleteWidget(notesWidget)
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
          desktop: activeDesktop.uuid,
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
              element.desktop === activeDesktop.uuid
          )[0].uuid,
        }));
      }
    } else {
      setNotesWidget((prev) => ({
        ...prev,
        is_collapsed: true,
      }));
    }
    updateWidget()
  };

  const draggableOnStop = (e: any, data: any) => {
    setNotesWidget((prev) => ({
      ...prev,
      widget_x: data.lastX,
      widget_y: data.lastY,
    }));
    setIsMoveable(false)
    updateWidget()
  };

  const changeZIndex = () => {
    setNotesWidget((prev) => ({
      ...prev,
      z_index: activeDesktop.max_z_index + 1,
    }));
    updateWidget()
  };

  return (
    <div className={s.Resize} style={{ zIndex: notesWidget.z_index }}>
      <Rnd
        minWidth={150}
        minHeight={150}
        default={{ x: widget.widget_x, y: widget.widget_y, width: notesWidget.widget_size_x, height: notesWidget.widget_size_y}}
        onDragStop={(e, data) => draggableOnStop(e, data)}
        onDragStart={() => setIsMoveable(true)}
        className={s.notesWidget}
        size={{
          width: notesWidget.widget_size_x,
          height: notesWidget.widget_size_y,
        }}
        onResizeStop={(e, direction, ref, d) => {
          setNotesWidget((prev) => ({
            ...prev,
            widget_size_x: prev.widget_size_x + d.width,
            widget_size_y: prev.widget_size_y + d.height,
          }))
          updateWidget()
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
            value={notesWidget.text}
            onChange={(event) => {
              setNotesWidget((prev) => ({
                ...prev,
                text: event.target.value,
              }));
              updateWidget()
            }}
            className={s.Textarea}
          ></textarea>
        </div>
      </Rnd>
    </div>
  );
};
