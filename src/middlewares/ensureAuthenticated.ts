import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../error/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError({
      status: 401,
      message: 'Missing token.',
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret) as TokenPayload;

    req.user = {
      id: decoded.sub,
    };

    return next();
  } catch (error) {
    throw new AppError({
      status: 401,
      message: 'Invalid token.',
    });
  }
}
