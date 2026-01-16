import { Route, Routes } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import Login from '../pages/Login/Login';

import GuardedRoute from './GuardedRoute';

import guardedRoutes from './routes';

function AppRouter() {
  return (
    <Routes>
      <Route path='*' element={<NotFoundPage />} />
      <Route path='/login' element={<Login />} />
      {guardedRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<GuardedRoute element={route.element} />}
        />
      ))}
    </Routes>
  );
}

export default AppRouter;
