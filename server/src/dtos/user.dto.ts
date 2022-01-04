import { Types, Document } from 'mongoose';
import { IUserModel } from '../types/user.type';

export class UserDto {
      email: string;
      id: Types.ObjectId;
      isActivated: boolean;

      constructor(model: Document<any, any, IUserModel> & IUserModel & {
            _id: Types.ObjectId;
        }) {
            this.email = model.email;
            this.id = model._id;
            this.isActivated = model.isActivated;
      }

}
