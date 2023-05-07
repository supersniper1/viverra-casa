import React, {FunctionComponent, useMemo} from 'react';
import { Component } from '@components/export.components';
import {socket} from "@/api/ws/socket";
import {useActions} from "@hooks/redux.useActions";
import s from './main.module.scss'

export const Main: FunctionComponent = () => {
  const {
    WidgetsRefreshList,
    Logout,
    Login,
  } = useActions()

  useMemo(() => {
    if (localStorage.getItem("access-token")) {
      socket.connect()
      socket.on("connect", () => {
        console.log('connect')
        Login()
      });
      socket.emit("get_all_widgets", null)
      socket.on("message", (message: any) => {
        console.log(message)
      })
      socket.on("error", (error: any) => {
        console.log(error)
        localStorage.clear()
        Logout()
      })
      socket.on("get_all_widgets_answer", (message: any) => {
        WidgetsRefreshList(message)
      })
    }}, []);

  return (
    <div className={s.Main}>
      <Component.Sidebar/>
      <Component.Workspace/>
    </div>
  );
};
