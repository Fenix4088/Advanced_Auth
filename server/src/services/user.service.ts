import { IGenerateTokensPayload } from '../types/token.type';
import UserModel from '../models/user.model';
import MailService from './mail.service';
import TokenService from './token.service';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../dtos/user.dto';

interface IRegistrationReturn {
      accessToken: string;
      refreshToken: string;
      user: IGenerateTokensPayload;
}

interface IUserService {
      registration(email: string, password: string): Promise<IRegistrationReturn>;
}

class UserService implements IUserService {
      public registration = async (email: string, password: string)=> {
            const candidate = await UserModel.findOne({email});

            if(candidate) throw new Error(`User ${email} already excisted!`);

            const activationLink = await uuidv4();

            const newUser = await UserModel.create({email, password: bcrypt.hashSync(password, 3), activationLink});
 
            await MailService.sendActivationMail(email, 'link');

            const userDto = new UserDto(newUser);

            const {accessToken, refreshToken} = TokenService.generateTokens({...userDto});

            await TokenService.saveToken(userDto.id, refreshToken);

            return {
                  accessToken,
                  refreshToken,
                  user: userDto
            }
      }
}

export default new UserService();