import { React, useEffect, useState } from 'react';
import Canvas from './components/Canvas';
import { io } from 'socket.io-client';
import { Box, HStack } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import ToolBox from './components/ToolBox';
import RoomPanel from './components/RoomPanel';

const App = () => {
  const [socket, setSocket] = useState();
  const [tool, setTool] = useState('brushTool');
  const [room, setRoom] = useState();
  const [color, setColor] = useState('#fffff');
  useEffect(() => {
    const initSocket = io('ws://localhost:3000');
    initSocket.on('connect', () => {
      console.log('WebSocket connected');
      setSocket(initSocket);
    });
    initSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    initSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    });
  }, []);

  return (
    <ChakraProvider>
      <HStack backgroundColor="blue" spacing="0" align="flex-start" position="relative">
        <Box pos="absolute">
          <ToolBox tool={tool} setTool={setTool} color={color} setColor={setColor} />
        </Box>
        <Box pos="absolute" display="flex" right="0px" bottom="50vh">
          <RoomPanel socket={socket} room={room} setRoom={setRoom} />
        </Box>
        <Canvas
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
