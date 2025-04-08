import { Schema, model } from 'mongoose';

const librSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: ['kids', 'roman'],
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

const LibrCollection = model('libr', librSchema);

export default LibrCollection;
