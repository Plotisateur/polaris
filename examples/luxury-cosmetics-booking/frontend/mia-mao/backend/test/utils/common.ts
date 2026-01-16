import { connectToMongoDB } from '../../src/loaders/database';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { apiRoutes } from '../../src/api/routes';
import dotenv from 'dotenv';
import path from 'path';
import { initPassport } from '../../src/api/middlwares/passport';
import Logger from '../../src/logger';
import { ErrorHandler, handleError } from '../../src/helpers/ErrorHandler';
import z from '../../src/helpers/zod';

export async function creatMockApp() {
  dotenv.config({ path: path.resolve(`.env.${process.env.NODE_ENV}.rc`) });
  await connectToMongoDB();
  const app = express();
  initPassport();
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
  app.use(`/`, apiRoutes);
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: err.message });
    } else if (err instanceof z.ZodError) {
      return res.status(403).json({ error: err.message });
    } else {
      next(err);
    }
  });

  app.use((err: ErrorHandler, _req: Request, res: Response, next: NextFunction) => {
    Logger.error('Error: %o', err.message);
    handleError(err, res, next);
  });
  return {
    app,
    refreshToken: 'test',
    accessToken: `test`,
  };
}
