import UserModel from '../models/user.model';
import MailService from './mail.service';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
interface IUserService {
      registration(email: string, password: string): void;

}

class UserService implements IUserService {
      public registration = async (email: string, password: string)=> {
            debugger;
            const candidate = await UserModel.findOne({email});

            if(candidate) throw new Error(`User ${email} already excisted!`);

            const activationLink = await uuidv4();
            console.log(activationLink)

            const newUser = await UserModel.create({email, password: bcrypt.hashSync(password, 3), activationLink});

            await MailService.sendActivationMail(email, 'link');

            await newUser.save();
      }
}

export default new UserService();