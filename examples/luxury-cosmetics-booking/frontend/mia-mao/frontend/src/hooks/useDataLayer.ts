import Cookies from 'universal-cookie';
import { cookiesPrefix } from './useAuthCookies';

const cookies = new Cookies();
const userId = cookies.get(`${cookiesPrefix}-gcpiapuserid`);

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

/* PAGE VIEW */
export const dataLayerPageView = () => {
  const generatePageTitle = location.pathname
    .split('/')
    .filter((e: string) => e != '')
    .map((e: string) => `${e.slice(0, 1).toUpperCase()}${e.slice(1)}`)
    .join(' - ');
  const page_title = `${generatePageTitle || 'Homepage'} | L'Oréal`;
  window.document.title = page_title;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    id: `${+new Date()}${Math.floor(Math.random() * 10000)}`,
    user_id: userId,
    page_title,
    page_location: window.document.location.href,
  });
};

/* CLICK */
export const dataLayerClick = ({ type, value }: { type: string; value?: string }) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'click',
    id: `${+new Date()}${Math.floor(Math.random() * 10000)}`,
    user_id: userId,
    type,
    value,
  });
};

/* TOGGLE */
export const dataLayerToggle = ({ type, value }: { type: string; value: string }) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'toggle',
    id: `${+new Date()}${Math.floor(Math.random() * 10000)}`,
    user_id: userId,
    type,
    value,
  });
};

/* Forms */

export const dataLayerFormStart = ({ type }: { type: string }) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_start',
    id: `${+new Date()}${Math.floor(Math.random() * 10000)}`,
    user_id: userId,
    type,
  });
};

export const dataLayerFormStep = ({ type, value }: { type: string; value: number }) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_step',
    id: `${+new Date()}${Math.floor(Math.random() * 10000)}`,
    user_id: userId,
    type,
    value,
  });
};

export const dataLayerFormSubmit = ({
  type,
  brand,
  category,
  value,
}: {
  type: string;
  brand?: string;
  category?: string;
  value?: any;
}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_submit',
    id: `${+new Date()}${Math.floor(Math.random() * 10000)}`,
    user_id: userId,
    type,
    category,
    brand,
    value,
  });
};
