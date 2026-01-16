import { Router } from 'express';
import passport from 'passport';

import login from '../modules/auth/routes';
import { asyncErrorHandler } from '../../helpers/ErrorHandler';
import { getUserAccessToken } from '../middlwares/getUserAccessToken';

export const apiRoutes = Router();

apiRoutes.use('/auth', login);
apiRoutes.use(passport.authenticate('header', { session: false }));
apiRoutes.use(asyncErrorHandler(getUserAccessToken));
