import React, {FunctionComponent} from 'react';
import {useTypedSelector} from "@hooks/redux.useTypedSelector";
import {Component} from "@components/export.components";
import s from "./workspace.module.scss"
import {Icons} from '@/assets/components/export';
import {useActions} from "@hooks/redux.useActions";
import {socket} from "@api/ws/socket";
import {IWidgetSlice} from "@store/slices/widgets/widgets.slice";

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
    "widget_size_x": 200,
    "widget_size_y": 200,
    "z_index": 1,
    "is_collapsed": false,
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

  const uncollapse = (widget: IWidgetSlice) => {
    const collapsedWidget = {
      ...widget,
      "is_collapsed": false,
    }
    socket.emit("update_widget", collapsedWidget)
    socket.emit("get_all_widgets", null)
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message)
    })
  }

  return (
    <div className={s.workspace}>
      {widgets.map((widget) => (
        widget.is_collapsed === false && (
          widget.widget_tag === 'note' && (
            <Component.Notes key={widget.widget_uuid} widget={widget}/>
          )
        )
      ))}
      <div className={s.bottomPanel}>
        {widgets.map((widget) => (
          widget.is_collapsed === true && (
            widget.widget_tag === 'note' && (
              <button onClick={() => uncollapse(widget)}>
                <Icons.NotesCollapsed className={s.NotesCollapsedIcon}/>
              </button>
            )
          )
        ))}
        <button onClick={postWidget} className={s.button}>
          <Icons.AddWidget className={s.addWidgetIcon}/>
        </button>
      </div>
    </div>
  )
}