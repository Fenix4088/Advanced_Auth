import { Types } from 'mongoose';

export interface IUserModel {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}


