import React, { FunctionComponent } from "react";

interface CreateDesktopIcon {
  [className: string]: string;
}

export const CreateDesktop: FunctionComponent<CreateDesktopIcon> = ({ className }) => (
  <img src={require("./create-desktop.svg")} className={className} />
);
