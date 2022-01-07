import { NextFunction } from 'express-serve-static-core';
import { TRequest } from '../types/common';
import { ApiErrors } from '../exceptions/api.errors';
import { Response } from 'express';

export const errorMiddleware = <REQ extends TRequest<{}, {}, {}>, RES extends Response = Response>(
  err: ApiErrors,
  req: REQ,
  res: RES,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof ApiErrors) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: 'Some error occured :-(' });
};
