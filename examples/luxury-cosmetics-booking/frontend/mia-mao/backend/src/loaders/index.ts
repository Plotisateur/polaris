import { Application } from 'express';
import Logger from '../logger';
import expressLoader from './express';

export default async (app: Application): Promise<void> => {
  expressLoader(app);
  Logger.info('Express loaded!');
};
