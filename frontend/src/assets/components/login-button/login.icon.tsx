import React, {FunctionComponent} from "react";
import {Links} from "../../links/links";

export const Login: FunctionComponent = () => (
  <button onClick={() => window.location.replace(Links.DiscordAuth)}>
    log in
  </button>
);
