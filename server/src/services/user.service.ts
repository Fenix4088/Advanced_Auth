import { IUserModel } from './../types/user.type';
import { ITokenModel } from './../types/token.type';
import { DocumentedObject } from './../types/common';
import { IGenerateTokensPayload } from '../types/token.type';
import UserModel from '../models/user.model';
import MailService from './mail.service';
import TokenService from './token.service';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../dtos/user.dto';
import { ApiErrors } from '../exceptions/api.errors';
import dotenv from 'dotenv';
dotenv.config();

interface IRegistrationReturn {
  accessToken: string;
  refreshToken: string;
  user: IGenerateTokensPayload;
}

interface IUserService {
  registration(email: string, password: string): Promise<IRegistrationReturn>;
  login(email: string, password: string): Promise<IRegistrationReturn>;
  logout(refreshToken: string): Promise<DocumentedObject<ITokenModel>>;
  refresh(refreshToken: string): Promise<any>;
  activate(link: string): Promise<void>;
  getAllUsers(): Promise<DocumentedObject<IUserModel>[]>;
}

class UserService implements IUserService {
  public registration = async (email: string, password: string) => {
    const candidate = await UserModel.findOne({ email });

    if (candidate) throw ApiErrors.BadRequest(`User ${email} already excisted!`);

    const activationLink = await uuidv4();

    const newUser = await UserModel.create({ email, password: bcrypt.hashSync(password, 3), activationLink });

    await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(newUser);

    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  };

  public login = async (email: string, password: string) => {
    const userData = await UserModel.findOne({ email });

    if (!userData) throw ApiErrors.BadRequest(`User: ${email} is not found :-(`);

    const isPassValid = bcrypt.compareSync(password, userData.password);

    if (!isPassValid) throw ApiErrors.BadRequest('Wrong password!');

    //     if (!userData.isActivated) throw ApiErrors.UnauthorizedError('Check you email for activation link');

    const userDto = new UserDto(userData);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  };

  public logout = async (refreshToken: string) => {
    const token = await TokenService.removeToken(refreshToken);

    if (!token) throw ApiErrors.BadRequest('Oops, you cant logout');

    return token;
  };

  public refresh = async (refreshToken: string) => {

      if(!refreshToken) throw ApiErrors.UnauthorizedError();

      const userData = TokenService.validateRefreshToken(refreshToken);
      const tokenFromDB = await TokenService.findToken(refreshToken);

      if(!userData || !tokenFromDB) throw ApiErrors.UnauthorizedError();

      if(typeof userData === 'string') throw ApiErrors.UnauthorizedError();

      const user = await UserModel.findById(userData.id);

      if(!user) throw ApiErrors.UnauthorizedError();

      const userDto = new UserDto(user);
      const tokens = TokenService.generateTokens({ ...userDto });
      await TokenService.saveToken(userDto.id, tokens.refreshToken);
  
      return {
        ...tokens,
        user: userDto,
      };

  };

  public activate = async (link: string) => {
    const user = await UserModel.findOne({ activationLink: link });

    if (!user) throw ApiErrors.BadRequest('Invalid activation link');

    user.isActivated = true;

    await user.save();
  };

  public getAllUsers = async () => {
    const users = await UserModel.find();
    return users;
  };

}

export default new UserService();
