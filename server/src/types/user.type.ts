import { Types } from 'mongoose';

export interface IUserModel {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}

export interface IRegistrationPayload extends Pick<IUserModel, 'email' | 'password'> {}


