import { io } from "socket.io-client";


export const getSocket = (userId: string) => {
  let socket = io(process.env.NEXT_PUBLIC_API_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      _id: userId || "",
    },
  });
  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
  });

  return socket;
};
