import React, {FunctionComponent, useEffect, useState} from 'react';
import {Square} from "@components/square/square.component";
import {Buttons} from "@components/buttons/buttons.component";
import {Icons} from "@assets/components/export";
import {socket} from "@/api/ws/socket";

export const Main: FunctionComponent = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    }

    const onDisconnect = () => {
      setIsConnected(false);
    }

    const onFooEvent = (value: any) => {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("connect_error", (err:any) => {
      console.log(`connect_error due to ${err.message}`);
      console.log(`connect_error due to ${err}`);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div>
      MainPage_Test_v9
      <Icons.Login/>
      <Square/>
      <Buttons/>
      {fooEvents}
    </div>
  );
};
