import { NextFunction } from "express-serve-static-core";
import { TRequest } from "../types/common";
import {Response} from 'express';
import { IRegistrationPayload } from "../types/user.type";
import UserService from '../services/user.service';

interface IUserController {
      registration(req: TRequest<{}, {}>, res: Response, next: NextFunction): void;
      login(req: TRequest<{}, {}>, res: Response, next: NextFunction): void;
      logout(req: TRequest<{}, {}>, res: Response, next: NextFunction): void;
      activate(req: TRequest<{}, {}>, res: Response, next: NextFunction): void;
      refresh(req: TRequest<{}, {}>, res: Response, next: NextFunction): void;
      getUsers(req: TRequest<{}, {}>, res: Response, next: NextFunction): void;
}

class UserController implements IUserController {

      public registration = async (req: TRequest<IRegistrationPayload, {}>, res: Response, next: NextFunction) => {
            try {
                  debugger;
                  const {email, password} = req.body;
                  await UserService.registration(email, password);

                  return res.status(200).json({message: `User ${email} created!`});
            } catch (error) {
                  //@ts-ignore
                  return res.status(400).json({errorMessage: error.message});
            }
      }

      public login = (req: TRequest<{}, {}>, res: Response, next: NextFunction) => {
            try {
                  
            } catch (error) {
                  
            }
      }

      public logout = (req: TRequest<{}, {}>, res: Response, next: NextFunction) => {
            try {
                  
            } catch (error) {
                  
            }
      }

      public activate = (req: TRequest<{}, {}>, res: Response, next: NextFunction) => {
            try {
                  
            } catch (error) {
                  
            }
      }

      public refresh = (req: TRequest<{}, {}>, res: Response, next: NextFunction) => {
            try {
                  
            } catch (error) {
                  
            }
      }

      public getUsers = (req: TRequest<{}, {}>, res: Response, next: NextFunction) => {
            try {
                  return res.status(200).json({message: 'Server in work'});
            } catch (error) {
                  
            }
      }

}


export default new UserController();