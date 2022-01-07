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
  validateAccessToken(token: string): string | jwt.JwtPayload  | null;
  validateRefreshToken(token: string): string | jwt.JwtPayload | null;
  findToken(token: string): Promise<DocumentedObject<ITokenModel> | null>;
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

  public validateAccessToken =  (token: string) => {
    try {
      const userData = jwt.verify(token, process.env.SECRET_KEY || '');
      if(!userData) throw new Error();
      return userData;
    } catch (error) {
      return null;
    }
  };

  public validateRefreshToken = (token: string) => {
    try {
      const userData = jwt.verify(token, process.env.SECRET_KEY_REFRESH || '');
      return userData;
    } catch (error) {
      return null;
    }
  };

  public findToken = async (refreshToken: string) => {
      return await TokenModel.findOne({refreshToken});
  };
}

export default new TokenService();
