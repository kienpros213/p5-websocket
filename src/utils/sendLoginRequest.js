import { instance } from '../API/configaxios';

export function SendLoginRequest(username, password, setIsLoggedIn) {
  return instance
    .post(`/auth/login`, { username: username, password: password })
    .then((response) => {
      if (response) {
        console.log(response.data.access_token);
        setIsLoggedIn(true);
        return { success: 'login success' };
      }
    })
    .catch((error) => {
      return { error: error.response.data.message };
    });
}
