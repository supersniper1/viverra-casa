import React, {FunctionComponent, useEffect} from 'react';
import { Component } from '@components/export.components';
import {Icons} from "@assets/components/export";
import {socket} from "@/api/ws/socket";
import { useParams } from 'react-router-dom';

export const Main: FunctionComponent = () => {
  let params = useParams();
  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      socket.on('connect', () => {
        console.log('connected')
      });
      socket.on("message", (message: any) => {
        console.log(message)
      })
      socket.emit("get_all_widgets")
    }}, []);

  return (
    <div>
      MainPage
      {params.token}
      <Icons.Login/>
      <Component.Notes/>
      <Component.Square/>
      <Component.Buttons/>
    </div>
  );
};
