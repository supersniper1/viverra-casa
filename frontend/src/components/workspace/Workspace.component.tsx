import React, {FunctionComponent} from 'react';
import {useTypedSelector} from "@hooks/redux.useTypedSelector";
import {Component} from "@components/export.components";
import s from "./workspace.module.scss"
import { Icons } from '@/assets/components/export';
import {useActions} from "@hooks/redux.useActions";
import {socket} from "@api/ws/socket";

export const Workspace: FunctionComponent = () => {
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets)

  console.log(widgets)

  const {
    WidgetsRefreshList,
  } = useActions()

  const notesObj = {
    "widget_tag": "note",
    "widget_x": 9,
    "widget_y": 8,
    "widget_size_x": 9,
    "widget_size_y": 8,
    "text": "test text",
    "resourcetype": "WidgetsNoteModel"
  }

  const postWidget = () => {
    socket.emit("post_widget", notesObj)
    socket.emit("get_all_widgets", null)
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message)
    })
  }

  return (
    <div className={s.workspace}>
      {widgets.map((widget) => (
        <div>
          {widget.widget_tag === 'note' && (
            <Component.Notes key={widget.widget_uuid} widget={widget}/>
          )}
        </div>
      ))}
      <div className={s.bottomPanel}>
        <button onClick={postWidget} className={s.button}>
          <Icons.AddWidget className={s.addWidgetIcon}/>
        </button>
      </div>
    </div>
  )
}