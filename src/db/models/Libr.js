import { Schema, model } from 'mongoose';

import { typeList } from '../../constants/librs.js';

import { handleSaveError, setUpdateSettings } from './hooks.js';

const librSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: typeList,
      default: 'kids',
      required: true,
    },
    total_page: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
// mongoose-хук (post - це після;  doc - це об'єкт з фронтенда; next - це "роби далі те що заплановано"):
librSchema.post('save', handleSaveError);

librSchema.pre(
  'findOneAndUpdate',
  setUpdateSettings,
  //хук для new:true i runValidators:true. Винесли його в файл hooks.js
  /*function (next) {
  this.options.new = true;
  this.options.runValidator = true;
  next();
  }*/
);
librSchema.post('findOneAndUpdate', handleSaveError);

const LibrCollection = model('libr', librSchema);

export default LibrCollection;
