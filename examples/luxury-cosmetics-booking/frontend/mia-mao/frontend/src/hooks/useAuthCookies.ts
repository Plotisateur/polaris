import Cookies from 'universal-cookie';
import config from '../config';

const cookies = new Cookies();

export type TemplateFrontCookies =
  | 'access_token'
  | 'expiry_at'
  | 'refresh_token'
  | 'gcpiapuserid'
  | 'userid';

export const cookiesPrefix = `template-front-${config.env}`;

export const useAuthCookies = () => {
  const deleteCookie = (cookieName: TemplateFrontCookies) => {
    cookies.remove(`${cookiesPrefix}-${cookieName}`);
  };

  const setCookie = (cookieName: TemplateFrontCookies, value: string) => {
    cookies.remove(`${cookiesPrefix}-${cookieName}`);
    cookies.set(`${cookiesPrefix}-${cookieName}`, value);
  };

  const isExist = (cookieName: TemplateFrontCookies) => {
    return !!cookies.get(`${cookiesPrefix}-${cookieName}`);
  };

  const getCookie = (cookieName: TemplateFrontCookies) => {
    return cookies.get(`${cookiesPrefix}-${cookieName}`);
  };

  const createAuthCookies = ({
    accessToken,
    refreshToken,
    expireAt,
  }: {
    accessToken: string;
    refreshToken: string;
    expireAt: number;
  }) => {
    setCookie('access_token', accessToken);
    setCookie('expiry_at', expireAt.toString());
    setCookie('refresh_token', refreshToken);
  };

  const deleteOldCookies = () => {
    cookies.remove('template-front_access_token');
    cookies.remove('template-front_token_expire_at');
    cookies.remove('template-front_refresh_token');
    cookies.remove('template-front_ACCESS_TOKEN');
    cookies.remove('template-front_TOKEN_EXPIRY_AT');
    cookies.remove('template-front_REFRESH_TOKEN');
    cookies.remove('template-front_GCPIAPUSERID');
    cookies.remove('template-front_gcpiapuserid');
    cookies.remove('template-front_gcpiapuserid');
  };

  return {
    deleteCookie,
    setCookie,
    isExist,
    getCookie,
    createAuthCookies,
    deleteOldCookies,
  };
};
