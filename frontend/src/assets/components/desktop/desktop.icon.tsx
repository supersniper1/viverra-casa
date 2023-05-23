import React, { FunctionComponent } from "react";

interface IDesktop {
  className?: string;
  index: number;
}

export const Desktop: FunctionComponent<IDesktop> = ({ className, index }) => (
  <img src={require(`./icons/desktop${index + 1}.svg`)} className={className} />
);
