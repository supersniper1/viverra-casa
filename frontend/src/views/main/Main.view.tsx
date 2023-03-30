import React, {FunctionComponent, useEffect} from 'react';
import {Square} from "@components/square/square.component";
import {Buttons} from "@components/buttons/buttons.component";
import {Icons} from "@assets/components/export";
import {socket} from "@/api/ws/socket";

export const Main: FunctionComponent = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    });
    socket.on('disconnect', () => {
      console.log('disconected')
    });
  }, []);

  return (
    <div>
      MainPage
      <Icons.Login/>
      <Square/>
      <Buttons/>
    </div>
  );
};
