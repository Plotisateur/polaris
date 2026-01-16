import express from 'express';
import { asyncErrorHandler } from '../../../helpers/ErrorHandler';
import { login } from './controller';

const router = express.Router();

router.get('/login', asyncErrorHandler(login));

export default router;
