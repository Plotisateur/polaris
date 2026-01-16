import { Schema, model } from 'mongoose';
import { IUser } from "./types/user";

const userMongoSchema = new Schema<IUser>({
  name: { type: String, required: false },
  email: { type: String, required: true },
  role: { type: String, required: false },
});
export const UserModel = model('User', userMongoSchema);
