import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Box,
  Button,
  Link,
  Collapse,
  Text,
  HStack,
  useDisclosure
} from '@chakra-ui/react';
import { SendLoginRequest } from '../utils/sendLoginRequest';
import { useState } from 'react';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(true);
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box backgroundColor="#0B2447" h="100vh" w="100vw" display="flex" justifyContent="center" alignItems="center">
      <FormControl backgroundColor="#19376D" h="auto" w="15%" borderRadius="10px" p="20px">
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
        <Collapse in={isOpen} animateOpacity>
          <FormLabel color="#A5D7E8">Confirm Password</FormLabel>
          <Input
            id="retype-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            backgroundColor="#A5D7E8"
            type="password"
          />
        </Collapse>
        <HStack mt={4}>
          <Button
            onClick={() => {
              SendLoginRequest(username, password, props.setIsLoggedIn);
            }}
          >
            Login
          </Button>
          <Text color="#A5D7E8">
            Don't have an account ?
            <Link onClick={onToggle} color="teal.500" href="#">
              that kinda gay, you know
            </Link>
          </Text>
        </HStack>
        <FormHelperText color="#A5D7E8">We'll never share your email, maybe.</FormHelperText>
      </FormControl>
    </Box>
  );
}

export default Login;
