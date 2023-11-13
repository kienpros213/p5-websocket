import { Box, Icon } from '@chakra-ui/react';

function OnlineBox(props) {
  return (
    <Box p="10px" h="auto" w="auto">
      {props.online.map((onlineUser, index) => {
        return (
          <div key={index}>
            <p>
              <Icon viewBox="0 0 200 200" color="green.500">
                <path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" />
              </Icon>{' '}
              {onlineUser}
            </p>
          </div>
        );
      })}
    </Box>
  );
}

export default OnlineBox;
