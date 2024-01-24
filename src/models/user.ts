import { defaultUser, urlRegex } from '../config';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import mongoose, { Model, Document } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials:
  (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: defaultUser.name,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
    default: defaultUser.about,
  },
  avatar: {
    type: String,
    required: true,
    default: defaultUser.avatar,
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: 'Incorrect url',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Incorrect email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: any) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
