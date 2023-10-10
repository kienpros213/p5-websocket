import { React, useEffect, useState } from 'react';
import Canvas from './components/Canvas';
import OnlineBox from './components/OnlineBox';
import { io } from 'socket.io-client';
import { HStack } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';

const App = () => {
  const [socket, setSocket] = useState();
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
      <HStack backgroundColor="#9EDDFF" w="100vw" h="100vh" display="flex" justifyContent="center" alignItems="center">
        <Canvas socket={socket} />;
        <OnlineBox socket={socket} />
      </HStack>
    </ChakraProvider>
  );
};

export default App;
