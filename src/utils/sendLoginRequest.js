import axios from 'axios';

const endpoint = 'http://localhost:3030';

export function SendLoginRequest(username, password, setIsLoggedIn) {
  axios({
    method: 'post',
    url: '' + endpoint + '/auth/login',
    data: {
      username: username,
      password: password
    }
  }).then(function (response) {
    if (response) {
      console.log(response.data.access_token);
      setIsLoggedIn(true);
    }
    return;
  });
}
