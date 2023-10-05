import { React, useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import { io } from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState();
  useEffect(() => {
    const initSocket = io("ws://localhost:3000");
    initSocket.on("connect", () => {
      console.log("WebSocket connected");
      setSocket(initSocket);
    });
    initSocket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
    initSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setSocket(null);
    });
  }, []);

  return <Canvas socket={socket} />;
};

export default App;
