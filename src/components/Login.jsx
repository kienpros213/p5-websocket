import { Stack } from '@chakra-ui/react';
import { SendLoginRequest } from '../utils/sendLoginRequest';

function Login(props) {
  return (
    <>
      <Stack dir="vertical">
        <input className="username" name="username" placeholder="username" />
        <input className="password" name="password" placeholder="password" />
        <button
          type="button"
          onClick={() => {
            SendLoginRequest(props.setIsLoggedIn);
          }}
        >
          login
        </button>
      </Stack>
    </>
  );
}

export default Login;
