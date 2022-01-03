import mongoose, { Schema } from 'mongoose';
import { IUserModel } from '../types/user';


const User: Schema = new Schema<IUserModel>({
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String},
});

export default mongoose.model<IUserModel>('Post', User);