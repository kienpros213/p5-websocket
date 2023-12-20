import { instance } from '../api/configaxios';

export async function SendRegisterRequest(username, password, email) {
  return instance
    .post(`/user/createuser`, { username: username, password: password, email: email })
    .then(() => {
      return { success: 'user created' };
    })
    .catch((error) => {
      return { error: error.response.data.message };
    });
}
