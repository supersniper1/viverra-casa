import React, { FunctionComponent } from "react";

interface UserIcon {
  [className: string]: string;
}

export const User: FunctionComponent<UserIcon> = ({ className }) => (
  <img src={require("./user.svg")} className={className} />
);
