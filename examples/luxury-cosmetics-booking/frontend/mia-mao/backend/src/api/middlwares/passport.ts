import passport from 'passport';
import passportBearer from 'passport-http-header-strategy';
import config from '../../config';
import Logger from '../../logger';
import models from '../models';

const BearerStrategy = passportBearer.Strategy;

export type GAxiosErrorType =
  | {
      response?: {
        data?: {
          error?: string;
          errorDescription?: string;
        };
        status?: number;
      };
    }
  | undefined;

export function initPassport() {
  passport.use(
    new BearerStrategy({ header: 'x-user-access-token' }, function (token, done) {
      (async () => {
        try {
          if ('test' === config.env) {
            const user = await models.User.findOne({
              email: 'mia.nasrkhneisser@loreal.com',
            }).lean();

            if (!user) {
              throw new Error('Invalid user');
            }

            return done(null, {
              ...user,
              token: token,
            });
          }
          const user = await models.User.findOne({ email: 'mia.nasrkhneisser@loreal.com' }).lean();

          if (!user) {
            throw new Error('Invalid user');
          }

          done(null, {
            ...user,
            token: token,
          });
        } catch (err) {
          const error = err as GAxiosErrorType;

          Logger.warn(`[Passport] Token validation failed: ${JSON.stringify(error)}`);

          done({ name: 'UnauthorizedError' });
        }
      })();
    })
  );
}
