import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  process.env.NODE_ENV === "production" ? "/test/" : "http://127.0.0.1:8000/test/",
  {
    forceNew: true,
    timeout: 10000,
    rejectUnauthorized: false
  }
);
