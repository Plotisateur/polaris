import { Request, Response, NextFunction } from 'express';

export class ErrorHandler extends Error {
  public statusCode: number;
  public message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (err: ErrorHandler, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    error: message,
  });
  next();
};

export function asyncErrorHandler<T, U>(
  fn: (request: Request<T>, response: Response<U>, next: NextFunction) => Promise<void> | void
) {
  return (request: Request<T>, response: Response<U>, next: NextFunction): void => {
    Promise.resolve(fn(request, response, next)).catch(next);
  };
}
