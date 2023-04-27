import React, { FunctionComponent } from "react";

interface AddWidgetIcon {
  [className: string]: string;
}

export const CloseWidget: FunctionComponent<AddWidgetIcon> = ({ className }) => (
  <img src={require("./close-widget.svg")} className={className} />
);
