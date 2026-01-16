import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config';
import { ErrorHandler, handleError } from '../helpers/ErrorHandler';
import Logger from '../logger';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { initPassport } from '../api/middlwares/passport';
import z from '../helpers/zod';
import { apiRoutes } from '../api/routes';
import { generateOpenApi } from '@ts-rest/open-api';
import { openapiContract } from './openApi';

export default (app: Application): void => {
  // Health Check endpoints
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });
  app.enable('trust proxy');

  // Enable Cross Origin Resource Sharing to all origins by default
  initPassport();
  app.use(cors());
  app.use(cookieParser());

  app.use(express.json());
  app.use(morgan('tiny'));
  app.use(express.static('public'));

  // Use Helmet to secure the app by setting various HTTP headers
  app.use(helmet());

  // Middleware that transforms the raw string of req.body into json
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());

  // Load API routes
  app.use(`/${config.endpointPrefix}`, apiRoutes);

  const openApiDocument = generateOpenApi(openapiContract, {
    info: {
      title: 'Project Template Backend API',
      version: '1.0.0',
    },
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openApiDocument);
  });

  // Hide x-powered-by from response header
  app.disable('x-powered-by');

  /// Error handlers
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    Logger.error('Error handlers Error: %o', err);
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ error: err.message });
    } else if (err instanceof z.ZodError) {
      res.status(403).json({ error: err.message });
    } else {
      Logger.info('Error handlers next: %o');
      next(err);
    }
  });

  app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res, next);
  });
};
