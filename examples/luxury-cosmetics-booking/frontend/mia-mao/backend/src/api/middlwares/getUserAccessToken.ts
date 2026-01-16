import { ErrorHandler } from '../../helpers/ErrorHandler';
import { NextFunction, Request, Response } from 'express';
import config from '../../config';

export let UserAccessToken: string;
export let UserRefreshAccessToken: string;

export async function getUserAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if ('test' === config.env) {
    UserAccessToken = 'Bearer test';
    UserRefreshAccessToken = 'test';
    return next();
  }
  if (!req.headers['x-user-access-token'] || !req.headers['x-user-refresh-token']) {
    throw new ErrorHandler(401, 'UnauthorizedError');
  }
  UserAccessToken = Array.isArray(req.headers['x-user-access-token'])
    ? req.headers['x-user-access-token'][0]
    : req.headers['x-user-access-token'];

  UserRefreshAccessToken = Array.isArray(req.headers['x-user-refresh-token'])
    ? req.headers['x-user-refresh-token'][0]
    : req.headers['x-user-refresh-token'];
  next();
}
