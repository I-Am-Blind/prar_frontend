import { io } from "socket.io-client";

let socket;

const connectSocket = () => {
  // Connect only in client side
  if (typeof window !== "undefined" && !socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

  }
};

const getSocket = () => {
  if (!socket) {
    connectSocket();
  }
  return socket;
};

export { getSocket, connectSocket };
