import React from "react";
import { createRoot } from "react-dom/client";
import { AppCore } from "./App";

createRoot(document.getElementById("app") as HTMLElement).render(<AppCore />);