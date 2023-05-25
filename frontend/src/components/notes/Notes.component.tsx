import React, { FunctionComponent, useMemo, useState } from "react";
import { IWidgetSlice } from "@store/slices/widgets/widgets.slice";
import { socket } from "@api/ws/socket";
import { useActions } from "@hooks/redux.useActions";
import s from "./notes.module.scss";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable } from "re-resizable";
import { Icons } from "@assets/components/export";
import cn from "classnames";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { IFolders } from "@/store/slices/folders/folders.slice";

interface INotes {
  widget: IWidgetSlice;
}

export const Notes: FunctionComponent<INotes> = ({ widget }) => {
  const [notesWidget, setNotesWidget] = useState(widget);

  const widgets = useTypedSelector((state) => state.Widgets.all_widgets);
  const folders = useTypedSelector((state) => state.Folders.all_folders);

  const { WidgetsRefreshList, SetFolders } = useActions();

  useMemo(() => {
    socket.emit("update_widget", notesWidget);
    console.log(notesWidget);
  }, [notesWidget]);

  useMemo(() => {
    socket.emit("get_all_widgets", null);
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message);
    });
  }, [notesWidget.is_collapsed]);

  const deleteWidget = () => {
    socket.emit("delete_widget", { widget_uuid: widget.widget_uuid });
    socket.emit("get_all_widgets", null);
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message);
    });
  };

  const collapseWidget = () => {
    if (widgets.filter((element) => element.widget_tag === "notes" &&
     element.is_collapsed === true).length > 1) // if collapsed notes more than 2 
      {
      if (folders.filter((element) => element.folder_name === "notes").length !== 1) // if notes don't have folder
       {
        socket.emit("post_folder", {"folder_name": "notes"})
        socket.emit("get_all_folders", null);
        socket.on("get_all_folders_answer", (message: IFolders) => {
          SetFolders(message);
        });
      }
      setNotesWidget((prev) => ({
        ...prev,
        is_collapsed: true,
        folder: folders.filter((element) => element.folder_name === "notes")[0].uuid,
      }));
    } else {
      setNotesWidget((prev) => ({
        ...prev,
        is_collapsed: true,
      }));
    }
  };

  const setZindex = () => {
    setNotesWidget((prev) => ({
      ...prev,
      z_index: prev.z_index + 1,
    }));
  };

  const draggableOnStop = (e: DraggableEvent, data: DraggableData) => {
    setNotesWidget((prev) => ({
      ...prev,
      widget_x: data.lastX,
      widget_y: data.lastY,
    }));
  };

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: widget.widget_x, y: widget.widget_y }}
      onStop={(e, data) => draggableOnStop(e, data)}
    >
      <Resizable
        style={{ zIndex: widget.z_index }}
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
        <div onMouseDown={setZindex}>
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
      </Resizable>
    </Draggable>
  );
};
