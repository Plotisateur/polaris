import React from 'react';
import config from '../config';
import { updateGCPIAPUSERID } from './utils';
import { useAuthCookies } from '../hooks/useAuthCookies';

const GuardedRoute = (guardedRouteProps: { element: JSX.Element }) => {
  const { isExist } = useAuthCookies();

  React.useEffect(() => {
    if (!isExist('gcpiapuserid')) {
      updateGCPIAPUSERID(config.env === 'local', true);
    }
  }, [isExist('gcpiapuserid')]);

  return guardedRouteProps.element;
};

export default GuardedRoute;
