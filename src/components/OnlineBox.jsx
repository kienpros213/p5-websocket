import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

function OnlineBox(props) {
  const [online, setOnline] = useState([]);

  useEffect(() => {
    if (props.socket) {
      props.socket.emit('connected');

      props.socket.on('userConnected', (payload) => {
        console.log(payload);
        const newOnline = payload;
        setOnline((prevOnline) => [...prevOnline, newOnline]);
      });

      props.socket.on('userDisconnected', (payload) => {
        console.log(payload);
        setOnline((prevOnline) => prevOnline.filter((user) => user !== payload));
      });
    }
  }, [props.socket]);

  return (
    <Box p="10px" h="auto" w="auto">
      {online.map((onlineUser, index) => {
        return (
          <div key={index}>
            <p>{onlineUser}</p>
          </div>
        );
      })}
    </Box>
  );
}

export default OnlineBox;
