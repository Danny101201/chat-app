import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface User {
  username: string;
  email: string;
  password: string;
  isAvatarImageSet?: boolean,
  AvatarImage?: string,
}
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
  username: { type: String, required: true, min: 3, max: 20, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 8 },
  isAvatarImageSet: { type: Boolean, default: false },
  AvatarImage: { type: String, default: '' },
});

// 3. Create a Model.
const User = model<User>('User', userSchema);
export default User