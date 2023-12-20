import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import RoomPanel from './components/RoomPanel';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import Threejs from './Threejs';
import { io } from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState();
  const [online, setOnline] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const initSocket = io('ws://localhost:3000');
      setSocket(initSocket);
      //on socket connect
      initSocket.on('connect', () => {
        console.log('WebSocket connected');
      });
      //on socket error
      initSocket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
      //on socket disconnect
      initSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setSocket(null);
      });

      initSocket.emit('connected', { username: username });
      initSocket.on('userConnected', (payload) => setOnline(payload));
      initSocket.on('userDisconnected', (payload) => setOnline(payload));
    }
  }, [isLoggedIn]);
  if (!isLoggedIn) {
    return (
      <ChakraProvider>
        <Login username={username} setUsername={setUsername} setIsLoggedIn={setIsLoggedIn} />
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
      <Box pos="absolute" display="flex" right="0px" bottom="50vh" zIndex="2">
        <RoomPanel socket={socket} room={room} setRoom={setRoom} online={online} />
      </Box>
      <Threejs socket={socket} username={username} setOnline={setOnline} room={room} />
    </ChakraProvider>
  );
};

export default App;
