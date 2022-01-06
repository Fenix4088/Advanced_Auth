import { IUserActivationReqParams } from './../types/user.type';
import { NextFunction } from "express-serve-static-core";
import { TRequest } from "../types/common";
import { Response } from 'express';
import { IRegistrationPayload } from "../types/user.type";
import UserService from '../services/user.service';
import dotenv from 'dotenv';

dotenv.config();

interface IUserController {
      registration(req: TRequest<{}, IRegistrationPayload, {}>, res: Response, next: NextFunction): void;
      login(req: TRequest<{}, {}, {}>, res: Response, next: NextFunction): void;
      logout(req: TRequest<{}, {}, {}>, res: Response, next: NextFunction): void;
      activate(req: TRequest<IUserActivationReqParams, {}, {}>, res: Response, next: NextFunction): void;
      refresh(req: TRequest<{}, {}, {}>, res: Response, next: NextFunction): void;
      getUsers(req: TRequest<{}, {}, {}>, res: Response, next: NextFunction): void;
}

class UserController implements IUserController {

      public registration = async (req: TRequest<{}, IRegistrationPayload, {}>, res: Response, next: NextFunction) => {
            try {
                  const {email, password} = req.body;
                  const userData = await UserService.registration(email, password);

                  res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});

                  return res.status(200).json({message: `User ${email} created!`, data: userData});
            } catch (error: any) {
                  next(error);
            }
      }

      public login = (req: TRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
            try {
                  
            } catch (error) {
                  next(error);
                  
            }
      }

      public logout = (req: TRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
            try {
                  
            } catch (error) {
                  next(error);
                  
            }
      }

      public activate = async (req: TRequest<IUserActivationReqParams, {}, {}>, res: Response, next: NextFunction) => {
            try {
                  const { link } = req.params;
                  await UserService.activate(link);

                  return res.redirect(process.env.CLIENT_URL || '');
            } catch (error) {
                  next(error);

            }
      }

      public refresh = (req: TRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
            try {
                  
            } catch (error) {
                  next(error);
                  
            }
      }

      public getUsers = (req: TRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
            try {
                  return res.status(200).json({message: 'Server in work'});
            } catch (error) {
                  next(error);
                  
            }
      }

}


export default new UserController();
