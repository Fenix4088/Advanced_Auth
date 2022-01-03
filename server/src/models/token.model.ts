import { model, Schema } from "mongoose";
import { ITokenModel } from "../types/token.type";

const Token = new Schema<ITokenModel>({
      user: {type: Schema.Types.ObjectId, required: true},
      refreshToken: {type: String, required: true}
});


export default model<ITokenModel>('Token', Token)