import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  process.env.NODE_ENV === "production" ? "ws://backend:8000/ws/socket-server/" : "ws://backend:8000/ws/socket-server/",
  {
    forceNew: true,
    timeout: 1000,
    transports: ["websocket"],
  }
);
