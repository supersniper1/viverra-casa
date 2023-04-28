import React, { FunctionComponent } from "react";

interface DiscordWidgetIcon {
  [className: string]: string;
}

export const DiscordWidget: FunctionComponent<DiscordWidgetIcon> = ({ className }) => (
  <img src={require("./discord-widget.svg")} className={className} />
);
