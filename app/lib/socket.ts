"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentUserId: string | null = null;

export const getSocket = (userId: string) => {
  if (socket && currentUserId === userId) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  currentUserId = userId;

  socket = io(process.env.NEXT_PUBLIC_API_URL, {
    auth: {
      _id: userId,
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected");
  });

  return socket;
};
