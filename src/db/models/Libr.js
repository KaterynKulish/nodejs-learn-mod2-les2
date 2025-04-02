import { Schema, model } from 'mongoose';

const librSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  total_page: {
    type: Number,
    required: true,
  },
});

const LibrCollection = model('libr', librSchema);

export default LibrCollection;
