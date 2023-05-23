import React, { FunctionComponent } from "react";
import "@ui/null.module.scss";

import { Provider } from "react-redux";
import { store } from "@store/store";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { View } from "@views/export.views";
import { Component } from "@/components/export.components";

const AppRouting: FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/main" element={<View.Main />} />
      <Route path="*" element={<Navigate to="/main" />} />
      <Route path="/set-token/*" element={<View.Redirect />} />
    </Routes>
  </BrowserRouter>
);

export const AppCore: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <Component.LoginModal />
      <AppRouting />
    </Provider>
  );
};
