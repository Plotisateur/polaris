import { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import axios, { baseUrlApi } from '../axios';
import { cookiesPrefix } from '@/hooks/useAuthCookies';

const cookies = new Cookies();

const accessToken = `${cookiesPrefix}-access_token`;
const refreshToken = `${cookiesPrefix}-refresh_token`;

export function request<T>(
  routePath: string,
  queryParams?: Record<string, unknown>
): Promise<AxiosResponse<T>> {
  return axios.get<T>(`${baseUrlApi}${routePath}`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'user-token': `${cookies.get(accessToken)}`,
      'user-refresh-token': `${cookies.get(refreshToken)}`,
    },
    params: queryParams,
  });
}
