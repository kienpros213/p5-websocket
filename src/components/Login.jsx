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
import { SendRegisterRequest } from '../utils/sendRegisterRequest';
import { useState } from 'react';
import { emailValidate } from '../utils/emailValidation';
import { passwordValidate } from '../utils/passwordValidation';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types'; // ES6

function Login(props) {
  const [emailIsValid, setEmailIsValid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box backgroundColor="#0B2447" h="100vh" w="100vw" display="flex" justifyContent="center" alignItems="center">
      <FormControl backgroundColor="#19376D" h="auto" w="15%" borderRadius="10px" p="20px">
        <Collapse in={isOpen} animateOpacity>
          <FormLabel color="#A5D7E8">Email</FormLabel>
          <Input
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onBlur={() => {
              emailValidate(email, setEmailError, setEmailIsValid);
            }}
            backgroundColor="#A5D7E8"
            type="email"
          />
          {emailError && <FormHelperText color="red">{emailError}</FormHelperText>}
        </Collapse>
        <FormLabel color="#A5D7E8">Username</FormLabel>
        <Input
          id="username"
          value={props.username}
          onChange={(e) => {
            props.setUsername(e.target.value);
          }}
          backgroundColor="#A5D7E8"
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
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            onBlur={() => {
              passwordValidate(password, confirmPassword, setPasswordError);
            }}
            backgroundColor="#A5D7E8"
            type="password"
          />
        </Collapse>
        {passwordError && <FormHelperText color="red">{passwordError}</FormHelperText>}
        <HStack mt={4}>
          <Button
            onClick={async () => {
              if (!isOpen) {
                const loginResponse = await const loginResponse = await SendLoginRequest(props.username, password, props.setIsLoggedIn);
                console.log(loginResponse);
                if (loginResponse.error) {
                  toast.error('' + loginResponse.error + '', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light'
                  });
                } else if (loginResponse.success) {
                  toast.success('' + loginResponse.success + '', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light'
                  });
                }
                if (loginResponse.error) {
                  toast.error('' + loginResponse.error + '', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light'
                  });
                }
              } else {
                if (emailIsValid) {
                  const registerResponse = await SendRegisterRequest(props.username, password, email, emailIsValid);
                  if (registerResponse.error) {
                    toast.error('' + registerResponse.error + '', {
                      position: 'top-center',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'light'
                    });
                  } else if (registerResponse.success) {
                    toast.success('' + registerResponse.success + '', {
                      position: 'top-center',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'light'
                    });
                  }
                }
              }
            }}
          >
            {isOpen ? 'Register' : 'Login'}
          </Button>
          <Text color="#A5D7E8">
            Don&apos;t have an account ?
            <Link onClick={onToggle} color="teal.500" href="#">
              don&apos;t have an account
            </Link>
          </Text>
        </HStack>
        {/* <FormHelperText color="#A5D7E8">We'll never share your email, maybe.</FormHelperText> */}
      </FormControl>
    </Box>
  );
}

Login.propTypes = { username: PropTypes.any, setIsLoggedIn: PropTypes.any, setUsername: PropTypes.any };

export default Login;
