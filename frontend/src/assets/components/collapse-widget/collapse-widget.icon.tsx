import React, { FunctionComponent } from "react";

interface CollapseWidgetIcon {
  [className: string]: string;
}

export const CollapseWidget: FunctionComponent<CollapseWidgetIcon> = ({ className }) => (
  <img src={require("./collapse-widget.svg")} className={className} />
);
