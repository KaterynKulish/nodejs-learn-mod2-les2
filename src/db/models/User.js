import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';

import { emailRegexp } from '../../constants/auth.js';

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      match: emailRegexp, //регул.вираз для валідації email
      unique: true,
      required: [true, 'Username must be exist'], //фраза для перевірки монгусом відповіді при порушенні унікальності
    },
    password: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', handleSaveError);

const UserCollection = model('user ', userSchema);

export default UserCollection;
