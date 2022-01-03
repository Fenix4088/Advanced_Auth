import { Types } from 'mongoose';

export interface ITokenModel {
      refreshToken: string;
      user: Types.ObjectId
}