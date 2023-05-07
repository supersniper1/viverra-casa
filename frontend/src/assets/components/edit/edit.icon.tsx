import React, { FunctionComponent } from "react";

interface EditIcon {
  [className: string]: string;
}

export const Edit: FunctionComponent<EditIcon> = ({ className }) => (
  <img src={require("./edit.svg")} className={className} />
);
