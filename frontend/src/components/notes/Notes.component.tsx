import React, {FunctionComponent, useMemo, useState} from 'react';
import {IWidgetSlice} from "@store/slices/widgets/widgets.slice";
import {socket} from "@api/ws/socket";
import {useActions} from "@hooks/redux.useActions";
import s from "./notes.module.scss";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {Resizable} from 're-resizable';
import {Icons} from "@assets/components/export";

interface Notes {
  widget: IWidgetSlice;
}

export const Notes: FunctionComponent<Notes> = ({widget}) => {
  const [notesWidget, setNotesWidget] = useState(widget)

  const {
    WidgetsRefreshList,
  } = useActions()

  useMemo(() => {
    socket.emit("update_widget", notesWidget)
  }, [notesWidget])

  useMemo(() => {
    socket.emit("get_all_widgets", null)
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message)
    })
  }, [notesWidget.is_collapsed])

  const deleteWidget = () => {
    socket.emit("delete_widget", {"widget_uuid": widget.widget_uuid})
    socket.emit("get_all_widgets", null)
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message)
    })
  }

  const collapseWidget = () => {
    setNotesWidget(prev => ({
      ...prev,
      is_collapsed: true,
    }))
  }

  const draggableOnStop = (e: DraggableEvent, data: DraggableData) => {
    setNotesWidget(prev => ({
      ...prev,
      widget_x: data.lastX,
      widget_y: data.lastY,
    }))
  }


  return (
    <Draggable
      handle=".handle"
      defaultPosition={{x: widget.widget_x, y: widget.widget_y}}
      onStop={(e, data) => draggableOnStop(e, data)}
    >
      <Resizable
        className={s.notesWidget}
        size={{
          width: notesWidget.widget_size_x,
          height: notesWidget.widget_size_y
        }}
        onResizeStop={(e, direction, ref, d) =>
          setNotesWidget(prev => ({
            ...prev,
            widget_size_x: prev.widget_size_x + d.width,
            widget_size_y: prev.widget_size_y + d.height,
          }))
        }
      >
        <div className={s.TopPanel}>
          <div className={`handle ${s.Handle}`}></div>
          <div className={s.Buttons}>
            <button className={s.CloseButton} onClick={collapseWidget}>
              <Icons.CollapseWidget/>
            </button>
            <button className={s.CloseButton} onClick={deleteWidget}>
              <Icons.CloseWidget/>
            </button>
          </div>
        </div>
        <textarea value={notesWidget.text} onChange={event => {
          setNotesWidget(prev => ({
            ...prev,
            text: event.target.value,
          }))
        }} className={s.Textarea}></textarea>
      </Resizable>
    </Draggable>
  )
}
