"use client";

import { io, Socket } from "socket.io-client";
import { socketConfig } from "@/shared/config/socket";

let socket: Socket | null = null;

export function getSupportSocket() {
  if (socket) return socket;
  socket = io(socketConfig.wsUrl, {
    withCredentials: true,
    transports: ["websocket"],
  });
  return socket;
}

export function disconnectSupportSocket() {
  socket?.disconnect();
  socket = null;
}
