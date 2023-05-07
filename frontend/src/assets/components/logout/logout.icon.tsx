import React, { FunctionComponent } from "react";

interface LogoutIcon {
  [className: string]: string;
}

export const Logout: FunctionComponent<LogoutIcon> = ({ className }) => (
  <img src={require("./logout.svg")} className={className} />
);
