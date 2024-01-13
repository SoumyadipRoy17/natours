import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  console.log(signup);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
    });
    console.log(res);
    if (res.data.status === 'sucess' || res.data.status === 'success') {
      showAlert('success', `Welcome to Natours.`);
      window.setTimeout(() => {
        window.location.replace('/me');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response.data.message);
  }
};
