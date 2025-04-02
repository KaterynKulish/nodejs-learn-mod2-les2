import LibrCollection from '../db/models/Libr.js';

export const getLibrs = () => LibrCollection.find();

export const getLibrById = (id) => LibrCollection.findOne({ _id: id });
