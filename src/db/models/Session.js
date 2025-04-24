import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users', //ref - це назва таблиці з якої береться ID
      required: true,
    },
    //токен для доступу:
    accessToken: {
      type: String,
      required: true,
    },
    //токен для оновлення:
    refreshToken: {
      type: String,
      required: true,
    },
    // час життя(для доступу):
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    // час життя(для оновлення):
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

sessionSchema.post('save', handleSaveError);

sessionSchema.pre('findOneAndUpdate', setUpdateSettings);

sessionSchema.post('findOneAndUpdate', handleSaveError);

const SessionCollection = model('session', sessionSchema);

export default SessionCollection;
