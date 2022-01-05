import { Types } from 'mongoose';
import { IUserModel } from './user.type';

export interface ITokenModel {
      refreshToken: string;
      user: Types.ObjectId
}


export interface IGenerateTokensPayload extends Pick<IUserModel, 'email' | 'isActivated'> {
      id: Types.ObjectId;
}