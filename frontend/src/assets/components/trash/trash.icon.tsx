import React, { FunctionComponent } from "react";

interface TrashIcon {
  [className: string]: string;
}

export const Trash: FunctionComponent<TrashIcon> = ({ className }) => (
  <img src={require("./trash.svg")} className={className} />
);
