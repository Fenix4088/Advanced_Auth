import { Types, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import TokenModel from '../models/token.model';
import { ITokenModel } from '../types/token.type';

dotenv.config();
interface IGenerateTokenReturn {
      accessToken: string;
      refreshToken: string;  
}
interface ITokenService {
      generateTokens(payload: any): IGenerateTokenReturn;
      saveToken(userId: Types.ObjectId, refreshToken: string): Promise<Document<any, any, ITokenModel> & ITokenModel & {
            _id: Types.ObjectId;
        }>
}

class TokenService implements ITokenService {

      public generateTokens = (payload: any) => {
            const accessToken = jwt.sign({}, process.env.SECRET_KEY || 'secret', {algorithm: 'ES256', expiresIn: '30m'});
            const refreshToken = jwt.sign({}, process.env.SECRET_KEY_REFRESH || 'secret-refresh', {algorithm: 'ES256', expiresIn: '30d'});

            return {
                  accessToken,
                  refreshToken
            }
      }

      public saveToken = async (userId: Types.ObjectId, refreshToken: string) => {
            const token = await TokenModel.findOne({user: userId});

            if(token) {
                  token.refreshToken = refreshToken;
                  return token.save();
            }

            const newToken = await TokenModel.create({user: userId, refreshToken});

            return newToken;
      }

}

export default new TokenService();