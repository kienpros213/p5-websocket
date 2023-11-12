import { React, useEffect, useState } from 'react';
import TestCanvas from './components/TestCanvas';
import { io } from 'socket.io-client';
import { Box, HStack } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import ToolBox from './components/ToolBox';
import RoomPanel from './components/RoomPanel';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [socket, setSocket] = useState();
  const [tool, setTool] = useState('brushTool');
  const [color, setColor] = useState('#fffff');
  const [strokeWeight, setStrokeWeight] = useState(5);
  const [room, setRoom] = useState();
  const [online, setOnline] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  useEffect(() => {
    const initSocket = io('ws://localhost:3000');
    setSocket(initSocket);
    initSocket.on('connect', () => {
      console.log('WebSocket connected');
    });
    initSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    initSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    });

    initSocket.emit('connected');

    initSocket.on('userConnected', (payload) => setOnline(payload));

    initSocket.on('userDisconnected', (payload) => setOnline(payload));

    return () => {
      initSocket.off('connect');
      initSocket.off('error');
      initSocket.off('disconnect');
      initSocket.off('userConnected');
      initSocket.off('userDisconnected');
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <ChakraProvider>
        <Login setIsLoggedIn={setIsLoggedIn} />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider>
      <HStack backgroundColor="blue" spacing="0" align="flex-start" position="relative">
        <Box pos="absolute">
          <ToolBox
            socket={socket}
            room={room}
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            setStrokeWeight={setStrokeWeight}
          />
        </Box>
        <Box pos="absolute" display="flex" right="0px" bottom="50vh" zIndex="2">
          <RoomPanel socket={socket} room={room} setRoom={setRoom} online={online} />
        </Box>
        <Box pos="absolute" display="flex" zIndex="0"></Box>
        <TestCanvas
          strokeWeight={strokeWeight}
          socket={socket}
          tool={tool}
          setTool={setTool}
          room={room}
          setRoom={setRoom}
          color={color}
          setColor={setColor}
        />
      </HStack>
    </ChakraProvider>
  );
};

export default App;
