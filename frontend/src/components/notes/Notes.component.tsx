import React, {FunctionComponent, useEffect, useState} from 'react';
import {IWidgetSlice} from "@store/slices/widgets/widgets.slice";
import {socket} from "@api/ws/socket";
import {useActions} from "@hooks/redux.useActions";
import s from "./notes.module.scss"
import Draggable from 'react-draggable';

interface Notes {
  widget: IWidgetSlice;
}

export const Notes: FunctionComponent<Notes> = ({widget}) => {
  const [notesWidget, setNotesWidget] = useState(widget)

  const {
    WidgetsRefreshList,
  } = useActions()

  useEffect(() => {
    socket.emit("update_widget", notesWidget)
  }, [notesWidget])

  const deleteWidget = () => {
    socket.emit("delete_widget", {"widget_uuid": widget.widget_uuid})
    socket.emit("get_all_widgets", null)
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message)
    })
  }

  return (
    <Draggable handle=".handle">
      <div className={s.notesWidget}>
        <div>
          <button onClick={deleteWidget}>x</button>
          <div className={`handle ${s.notesWidgetHandle}`}></div>
        </div>
        <textarea value={notesWidget.text} onChange={event => {
          setNotesWidget(prev => ({
            ...prev,
            text: event.target.value,
          }))
        }} className={s.notesWidgetTextarea}></textarea>
      </div>
    </Draggable>
  )
}