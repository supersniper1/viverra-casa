import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:/",
  {
    forceNew: true,
    timeout: 1000,
    transports: ["websocket"],
  }
);
