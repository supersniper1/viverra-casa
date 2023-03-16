import React from "react";
import 'normalize.scss/normalize.scss'
import { createRoot } from "react-dom/client";
import { AppCore } from "./App";

createRoot(document.getElementById("app") as HTMLElement).render(<AppCore />);
