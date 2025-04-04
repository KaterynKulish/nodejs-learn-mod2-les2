import LibrCollection from '../db/models/Libr.js';

export const getLibrs = () => LibrCollection.find();

export const getLibrById = (id) => {
  //   throw new Error('Database crashed'); // для імітації не працюючого бекенду
  return LibrCollection.findOne({ _id: id });
};
