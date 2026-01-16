import Cookies from 'universal-cookie';
import { cookiesPrefix } from '../../hooks/useAuthCookies';

const cookies = new Cookies();

const accessToken = `${cookiesPrefix}-access_token`;
const refreshToken = `${cookiesPrefix}-refresh_token`;

export const getHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'user-token': `${cookies.get(accessToken)}`,
  'user-refresh-token': `${cookies.get(refreshToken)}`,
});
