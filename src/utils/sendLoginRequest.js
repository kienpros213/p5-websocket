import axios from 'axios';

const endpoint = 'http://localhost:3030';

export function SendLoginRequest(setIsLoggedIn) {
  const username = document.getElementsByClassName('username');
  const password = document.getElementsByClassName('password');
  console.log(username[0].value, password[0].value);

  axios({
    method: 'post',
    url: '' + endpoint + '/auth/login',
    data: {
      username: username[0].value,
      password: password[0].value
    }
  }).then(function (response) {
    if (response) {
      console.log(response.data.access_token);
      setIsLoggedIn(true);
    }
    return;
  });
}
