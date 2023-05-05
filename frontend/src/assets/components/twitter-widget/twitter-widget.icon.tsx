import React, { FunctionComponent } from "react";

interface TwitterWidgetIcon {
  [className: string]: string;
}

export const TwitterWidget: FunctionComponent<TwitterWidgetIcon> = ({ className }) => (
  <img src={require("./twitter-widget.svg")} className={className} />
);
