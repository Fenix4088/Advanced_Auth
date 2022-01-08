import { ApiErrors } from './../exceptions/api.errors';
import { NextFunction } from 'express-serve-static-core';
import { TRequest } from '../types/common';
import { Response } from 'express';
import TokenService from '../services/token.service';
import { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = <REQ extends TRequest<{}, {}, {}> & { user?: JwtPayload }, RES extends Response = Response>(
  req: REQ,
  res: RES,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return next(ApiErrors.UnauthorizedError());

    const [_, token] = auth.split(' ');

    if (!token) return next(ApiErrors.UnauthorizedError());

    const userData = TokenService.validateAccessToken(token);

    if (!userData) return next(ApiErrors.UnauthorizedError());

    if (typeof userData === 'string') return next(ApiErrors.UnauthorizedError());

    req.user = userData;
    next();
  } catch (error: any) {
    return next(ApiErrors.UnauthorizedError());
  }
};
