import Cookies from 'universal-cookie';
import axios, { baseUrlApi } from '../../api/axios';
import { cookiesPrefix } from '../../hooks/useAuthCookies';

const cookies = new Cookies();

async function updateGCPIAPUSERID(isDev: boolean, reload = false) {
  if (isDev) {
    cookies.set(`${cookiesPrefix}-gcpiapuserid`, 'user-test-id');
    if (reload) {
      window.location.reload();
    }
    return;
  }

  try {
    const { data } = await axios.request({
      url: `${baseUrlApi}/api/user-sub`,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    cookies.set(`${cookiesPrefix}-gcpiapuserid`, data.sub);
    if (reload) {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}

export { updateGCPIAPUSERID };
