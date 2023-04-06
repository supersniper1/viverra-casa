import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  process.env.NODE_ENV === "production" ? "/widget/" : "http://158.160.30.44/widget/",
  {
    extraHeaders: {
      "Authorization": `Bearer ${localStorage.getItem("access-token")}`
    },
    forceNew: true,
    timeout: 10000,
    rejectUnauthorized: false,
    transports:  ['websocket', 'polling', 'flashsocket']
  }
);
