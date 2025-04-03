import LibrCollection from '../db/models/Libr.js';

export const getLibrs = () => LibrCollection.find();

export const getLibrById = (id) => {
  throw new Error('Database crashed');
  return LibrCollection.findOne({ _id: id });
};
