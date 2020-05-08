import { Request, Response, NextFunction } from 'express';

import AppError from '../error/AppError';

export default (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
): Response => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: 'error',
      error: err.message,
    });
  }

  console.error(err);

  return res
    .status(500)
    .json({ status: 'error', error: 'Internal server error.' });
};
