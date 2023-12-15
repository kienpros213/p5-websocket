import { React, useEffect, useState } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import RoomPanel from './components/RoomPanel';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import Threejs from './Threejs';

const App = () => {
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState();
  const [online, setOnline] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

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
  console.log(username);
  return (
    <ChakraProvider>
      <Box pos="absolute" display="flex" right="0px" bottom="50vh" zIndex="2">
        <RoomPanel socket={socket} room={room} setRoom={setRoom} online={online} />
      </Box>
      <Threejs username={username} setOnline={setOnline} />
    </ChakraProvider>
  );
};

export default App;
