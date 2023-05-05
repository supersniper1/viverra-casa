import React, { FunctionComponent } from "react";

interface NotesWidgetIcon {
  [className: string]: string;
}

export const NotesWidget: FunctionComponent<NotesWidgetIcon> = ({ className }) => (
  <img src={require("./notes-widget.svg")} className={className} />
);
