import React, { FunctionComponent } from "react";

interface NotesCollapsedIcon {
  [className: string]: string;
}

export const NotesCollapsed: FunctionComponent<NotesCollapsedIcon> = ({ className }) => (
  <img src={require("./notes-collapsed.svg")} className={className} />
);
