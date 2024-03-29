import React, {FunctionComponent} from "react";
import { Provider } from "react-redux";
import { store } from '@store/store';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { View } from "@views/export.views";

const AppRouting: FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/main' element={<View.Main/>}/>
      <Route path='/test' element={<View.Test/>}/>
      <Route path='*' element={<Navigate to="/main"/>}/>
      <Route path="/set-token/*" element={<View.Redirect/>}/>
    </Routes>
  </BrowserRouter>
);

export const AppCore: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <AppRouting/>
    </Provider>
  )
};
