import React, {FunctionComponent} from 'react';
import {useActions} from "@hooks/redux.useActions";
import {socket} from "@api/ws/socket";

export const Buttons: FunctionComponent = () => {

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


  const {
    TestChangeWidth,
    TestChangeHeight,
  } = useActions()

  const postWidget = () => {
    socket.emit("post_widget", notesObj)
    socket.emit("get_all_widgets", null)
    socket.on("get_all_widgets_answer", (message: any) => {
      WidgetsRefreshList(message)
    })
  }

  return (
    <div>
      <button onClick={postWidget}>add notes widget</button>
      <button onClick={() => TestChangeWidth(200)}>width +</button>
      <button onClick={() => TestChangeHeight(200)}>height +</button>
    </div>
  );
};
