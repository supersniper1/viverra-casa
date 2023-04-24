import React, { FunctionComponent } from "react";

interface AddWidgetIcon {
  [className: string]: string;
}

export const AddWidget: FunctionComponent<AddWidgetIcon> = ({ className }) => (
  <img src={require("./add-widget.svg")} className={className} />
);