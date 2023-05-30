import {io, Socket} from "socket.io-client";

export const socket: Socket = io(
  process.env.NODE_ENV === "production" ? "http://sovraska.ru/widget" : "http://sovraska.ru/widget",
  {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization:
            `Bearer ${localStorage.getItem("access-token")}`
        }
      }
    },
    forceNew: true,
    timeout: 10000,
    rejectUnauthorized: false,
    autoConnect: false,
    reconnection: false,
    transports: ['polling', 'flashsocket']
  }
);
