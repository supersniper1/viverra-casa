import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  process.env.NODE_ENV === "production" ? "/ws/socket-server/" : "http://127.0.0.1:8000/ws/socket-server/",
  {
    forceNew: true,
    timeout: 10000,
    rejectUnauthorized: false,
    transports : ['websocket']
  }
);
