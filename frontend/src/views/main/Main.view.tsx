import React, {FunctionComponent, useMemo} from 'react';
import { Component } from '@components/export.components';
import {Icons} from "@assets/components/export";
import {socket} from "@/api/ws/socket";
import { useParams } from 'react-router-dom';
import {useActions} from "@hooks/redux.useActions";

export const Main: FunctionComponent = () => {
  const {
    WidgetsRefreshList,
  } = useActions()

  let params = useParams();
  useMemo(() => {
    if (localStorage.getItem("access-token")) {
      socket.connect()
      socket.on("connect", () => {
        console.log('connect')
      });
      socket.emit("get_all_widgets", null)
      socket.on("message", (message: any) => {
        console.log(message)
      })
      socket.on("error", (error: any) => {
        console.log(error)
      })
      socket.on("get_all_widgets_answer", (message: any) => {
        WidgetsRefreshList(message)
      })
    }}, []);

  return (
    <div>
      <Icons.Login/>
      <Component.Workspace/>
    </div>
  );
};
