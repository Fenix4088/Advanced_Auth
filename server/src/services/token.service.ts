import { DocumentedObject } from './../types/common';
import { Types, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import TokenModel from '../models/token.model';
import { IGenerateTokensPayload, ITokenModel } from '../types/token.type';

dotenv.config();
interface IGenerateTokenReturn {
  accessToken: string;
  refreshToken: string;
}

interface ITokenService {
  generateTokens(payload: IGenerateTokensPayload): IGenerateTokenReturn;
  saveToken(userId: Types.ObjectId, refreshToken: string): Promise<DocumentedObject<ITokenModel>>;
  removeToken(refreshToken: string): Promise<DocumentedObject<ITokenModel> | null>;
}

class TokenService implements ITokenService {
  public generateTokens = (payload: IGenerateTokensPayload) => {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY || 'secret', { expiresIn: '30m', algorithm: 'HS256' });
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH || 'secret-refresh', { expiresIn: '30d', algorithm: 'HS256' });

    return {
      accessToken,
      refreshToken,
    };
  };

  public saveToken = async (userId: Types.ObjectId, refreshToken: string) => {
    const token = await TokenModel.findOne({ user: userId });

    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }

    const newToken = await TokenModel.create({ user: userId, refreshToken });

    return newToken;
  };

  public removeToken = async (refreshToken: string) => {
    return await TokenModel.findOneAndDelete({ refreshToken });
  };
}

export default new TokenService();
