import { instance } from '../API/configaxios';

export function SendRegisterRequest(username, password, email) {
  return instance
    .post(`/user/createuser`, { username: username, password: password, email: email })
    .then((response) => response)
    .catch((error) => error.response.data);
}
