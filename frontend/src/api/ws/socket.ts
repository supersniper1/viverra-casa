import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  process.env.NODE_ENV === "production" ? "/ws/" : "http://127.0.0.1:8000/widget/",
  {
    forceNew: true,
    timeout: 10000,
    rejectUnauthorized: false
  }
);
