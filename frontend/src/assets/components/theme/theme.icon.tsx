import React, { FunctionComponent } from "react";

interface ThemeIcon {
  [className: string]: string;
}

export const Theme: FunctionComponent<ThemeIcon> = ({ className }) => (
  <img src={require("./theme.svg")} className={className} />
);
