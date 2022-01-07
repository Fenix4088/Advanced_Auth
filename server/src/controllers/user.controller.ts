import { RerquestExpressValidator } from './../types/common';
import { IUserActivationReqParams } from './../types/user.type';
import { NextFunction } from 'express-serve-static-core';
import { TRequest } from '../types/common';
import { Response } from 'express';
import { IRegistrationPayload } from '../types/user.type';
import UserService from '../services/user.service';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { ApiErrors } from '../exceptions/api.errors';

dotenv.config();

interface IUserController {
  registration(req: RerquestExpressValidator<IRegistrationPayload>, res: Response, next: NextFunction): void;
  login(req: TRequest<{}, IRegistrationPayload, {}>, res: Response, next: NextFunction): void;
  logout(req: TRequest<{}, {}, {}>, res: Response, next: NextFunction): void;
  activate(req: TRequest<IUserActivationReqParams, {}, {}>, res: Response, next: NextFunction): void;
  refresh(req: TRequest<{}, {}, {}>, res: Response, next: NextFunction): void;
  getUsers(req: TRequest<{}, {}, {}>, res: Response, next: NextFunction): void;
}

class UserController implements IUserController {
  public registration = async (req: RerquestExpressValidator<IRegistrationPayload>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiErrors.BadRequest('Validation error', errors.array()));
      }

      const { email, password } = req.body;
      const userData = await UserService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.status(200).json({ message: `User ${email} created!`, data: userData });
    } catch (error: any) {
      next(error);
    }
  };

  public login = async (req: TRequest<{}, IRegistrationPayload, {}>, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const userData = await UserService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(200).json({ message: `Welcome!`, data: userData });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: TRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;

      const token = await UserService.logout(refreshToken);

      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'Bue bue, my friend! ;-)', token });
    } catch (error) {
      next(error);
    }
  };

  public activate = async (req: TRequest<IUserActivationReqParams, {}, {}>, res: Response, next: NextFunction) => {
    try {
      const { link } = req.params;
      await UserService.activate(link);

      return res.redirect(process.env.CLIENT_URL || '');
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: TRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;

      const userData = await UserService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(200).json({ message: `Token refreshed!`, data: userData });
    } catch (error) {
      next(error);
    }
  };

  public getUsers = (req: TRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: 'Server in work' });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
