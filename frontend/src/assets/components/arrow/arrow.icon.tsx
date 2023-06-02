import React, { FunctionComponent } from "react";

interface ArrowIcon {
  [className: string]: string;
}

export const Arrow: FunctionComponent<ArrowIcon> = ({ className }) => (
  <img src={require("./arrow.svg")} className={className} />
);
