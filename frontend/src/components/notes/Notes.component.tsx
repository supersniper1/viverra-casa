import React, {FunctionComponent, useEffect, useState} from 'react';
import {IWidgetSlice} from "@store/slices/widgets/widgets.slice";
import {socket} from "@api/ws/socket";
import {useActions} from "@hooks/redux.useActions";

interface Notes {
  widget: IWidgetSlice;
}

export const Notes: FunctionComponent<Notes> = ({widget}) => {
  const [notesTextValue, setNotesTextValue] = useState(widget.text)

  const {
    UpdateWidget,
  } = useActions()

  useEffect(() => {
    socket.emit("update_widget", widget)
  }, [notesTextValue])

    return (
        <div>
            <h2>Notes Widget</h2>
            <textarea value={notesTextValue} onChange={event => {
              setNotesTextValue(event.target.value)
              UpdateWidget(widget.widget_uuid)
            }}></textarea>
        </div>
    )
}