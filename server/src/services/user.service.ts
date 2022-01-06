import { IGenerateTokensPayload } from '../types/token.type';
import UserModel from '../models/user.model';
import MailService from './mail.service';
import TokenService from './token.service';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../dtos/user.dto';
import { ApiErrors } from '../exceptions/api.errors';

interface IRegistrationReturn {
      accessToken: string;
      refreshToken: string;
      user: IGenerateTokensPayload;
}

interface IUserService {
      registration(email: string, password: string): Promise<IRegistrationReturn>;
      login(email: string, password: string): any;
      activate(link: string): void;
}

class UserService implements IUserService {
      public registration = async (email: string, password: string)=> {
            const candidate = await UserModel.findOne({email});

            if(candidate) throw ApiErrors.BadRequest(`User ${email} already excisted!`);

            const activationLink = await uuidv4();

            const newUser = await UserModel.create({email, password: bcrypt.hashSync(password, 3), activationLink});
 
            await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

            const userDto = new UserDto(newUser);

            const {accessToken, refreshToken} = TokenService.generateTokens({...userDto});

            await TokenService.saveToken(userDto.id, refreshToken);

            return {
                  accessToken,
                  refreshToken,
                  user: userDto
            }
      }

      public login = async (email: string, password: string) => {
            const userData = await UserModel.findOne({email});

            if(!userData) {
                  throw ApiErrors.BadRequest(`User: ${email} is not authorized`);
            }

            const isPassValid = bcrypt.compareSync(password, userData.password);

      }

      public activate = async (link: string) => {
            const user = await UserModel.findOne({activationLink: link});

            if(!user) throw ApiErrors.BadRequest('Invalid activation link');

            user.isActivated = true;

            await user.save();
      }

}

export default new UserService();