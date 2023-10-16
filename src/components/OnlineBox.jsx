import { Box } from '@chakra-ui/react';

function OnlineBox(props) {
  console.log(props.online);
  return (
    <Box p="10px" h="auto" w="auto">
      {props.online.map((onlineUser, index) => {
        return (
          <div key={index}>
            <p>
              {index} - {onlineUser}
            </p>
          </div>
        );
      })}
    </Box>
  );
}

export default OnlineBox;
