import { FormControl, FormLabel, FormHelperText, Input, Box, Button } from '@chakra-ui/react';
import { SendLoginRequest } from '../utils/sendLoginRequest';
import { useState } from 'react';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box backgroundColor="#0B2447" h="100vh" w="100vw" display="flex" justifyContent="center" alignItems="center">
      <FormControl backgroundColor="#19376D" h="30%" w="30%" borderRadius="10px" p="20px">
        <FormLabel color="#A5D7E8">Username</FormLabel>
        <Input
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          backgroundColor="#A5D7E8"
          type="email"
        />
        <FormLabel color="#A5D7E8">Password</FormLabel>
        <Input
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          backgroundColor="#A5D7E8"
          type="password"
        />
        <Button
          onClick={() => {
            SendLoginRequest(username, password, props.setIsLoggedIn);
          }}
          mt={4}
        >
          Login
        </Button>
        <FormHelperText color="#A5D7E8">We'll never share your email.</FormHelperText>
      </FormControl>
    </Box>
  );
}

export default Login;
