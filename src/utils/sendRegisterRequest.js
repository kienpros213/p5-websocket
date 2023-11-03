import axios from 'axios';

const endpoint = 'http://localhost:3000';

export function SendRegisterRequest(username, password, email) {
  axios({
    method: 'post',
    url: '' + endpoint + '/user/createuser',
    data: {
      username: username,
      password: password,
      email: email
    }
  }).then(function (response) {
    if (response) {
      console.log(response);
    }
    return;
  });
}
