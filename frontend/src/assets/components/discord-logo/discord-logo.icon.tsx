import React, { FunctionComponent } from "react";

interface DiscordLogoIcon {
  [className: string]: string;
}

export const DiscordLogo: FunctionComponent<DiscordLogoIcon> = ({ className }) => (
  <img src={require("./discord-logo.svg")} className={className} />
);
